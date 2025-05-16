import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatOpenAI } from "https://esm.sh/@langchain/openai@0.0.10";
import { StructuredOutputParser } from "https://esm.sh/langchain@0.0.146/output_parsers";
import { RunnableSequence } from "https://esm.sh/@langchain/core@0.1.5/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "https://esm.sh/@langchain/core@0.1.5/prompts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { recipeModificationsSchema } from "./schema.ts";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";
import { storeRecipeVersion, getLatestVersionNumber } from "../_shared/recipe-versions.ts";

// === retry helper ===
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 500): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (++retries > maxRetries) throw err;
      const delay = initialDelay * 2 ** (retries - 1);
      console.warn(`Retry ${retries}/${maxRetries} after ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// === circuit breaker ===
class CircuitBreaker {
  private failures = 0;
  private openUntil: number = 0;

  constructor(private maxFailures = 5, private resetMs = 30_000) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (Date.now() < this.openUntil) {
      throw new Error("Circuit is open");
    }
    try {
      const res = await fn();
      this.failures = 0;
      return res;
    } catch (err) {
      if (++this.failures >= this.maxFailures) {
        this.openUntil = Date.now() + this.resetMs;
      }
      throw err;
    }
  }
}
const openAICircuit = new CircuitBreaker();

// === build LangChain pipeline ===
function createLangChainSequence() {
  const parser = StructuredOutputParser.fromZodSchema(recipeModificationsSchema);
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) throw new Error("OPENAI_API_KEY missing");

  const model = new ChatOpenAI({
    openAIApiKey: key,
    modelName: "gpt-4o",
    temperature: 0.2,
    timeout: 60_000,
    maxRetries: 0, // we handle retries ourselves
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `
You are a culinary nutrition expert. When modifying recipes:
1) Return a COMPLETE recipe that includes ALL fields from the original recipe with your modifications applied.
2) Keep flavors balanced and use logical substitutions.
3) Honor cooking chemistry principles in substitutions.
4) Recalculate nutrition values when ingredients change.
5) Follow the exact schema structure of the original recipe.
6) DO NOT return just the changes - return the entire recipe with changes applied.
7) Include a modification_reason field in version_info explaining the changes.
8) Maintain all original recipe fields even if you don't modify them.

CRITICAL: When adding new ingredients, ALWAYS update the instructions with FULL DETAILED STEPS for using these ingredients.
DO NOT include placeholder instructions like "Add bacon cooking steps" - instead, write precise, complete cooking instructions.

For example, if adding bacon to a recipe, your instructions must include specific steps like:
"Place bacon strips in a cold skillet. Cook over medium heat for 8-10 minutes, turning occasionally until bacon is golden brown and crispy. Transfer to a paper towel-lined plate to drain excess fat. Once cooled, chop into small pieces and set aside."

Instructions with placeholders like "Add steps" or "Add cooking steps" will be rejected. You must provide detailed, specific cooking instructions for any new ingredients.

IMPORTANT: Your response must contain a complete recipe object with all fields from the original that match the recipe generation format.
`],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);

  return RunnableSequence.from([
    { input: (r) => r.input, history: (r) => r.history || [] },
    prompt,
    model,
    parser
  ]);
}

// === validate incoming recipe ===
function validateRecipe(recipe: any) {
  if (!recipe?.title) throw new Error("Missing recipe.title");
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0)
    throw new Error("Must have at least one ingredient");
  if (!Array.isArray(recipe.steps) && !Array.isArray(recipe.instructions))
    throw new Error("Must have steps or instructions");
}

// === validate instructions ===
function validateInstructions(instructions: string[] | null | undefined): boolean {
  if (!instructions || !Array.isArray(instructions) || instructions.length === 0) {
    return false;
  }
  
  // Check for placeholder instructions
  const placeholderPatterns = [
    /add (\w+) cooking steps/i,
    /add steps/i, 
    /add instructions/i,
    /add detailed steps/i,
    /placeholder/i
  ];
  
  // If any instruction matches a placeholder pattern, it's invalid
  const hasPlaceholders = instructions.some(instruction => 
    placeholderPatterns.some(pattern => pattern.test(instruction))
  );
  
  // Instructions should have reasonable length
  const hasShortInstructions = instructions.some(instruction => 
    instruction.length < 15
  );
  
  return !hasPlaceholders && !hasShortInstructions;
}

// === edge function ===
serve(async (req) => {
  // CORS headers for all responses
  const headers = getCorsHeadersWithOrigin(req);
  
  // Handle CORS preflight requests - explicitly check for OPTIONS method
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, // Use 204 No Content for OPTIONS
      headers 
    });
  }

  let requestPayload: any;
  try {
    requestPayload = await req.json();
    console.log("Modification request received with payload keys:", Object.keys(requestPayload));
    const { recipe, userRequest } = requestPayload;
    console.log("Recipe ID:", recipe?.id || "missing");
    console.log("User Request:", userRequest?.substring(0, 50) + (userRequest?.length > 50 ? "..." : ""));
  } catch (parseErr) {
    console.error("Failed to parse request JSON:", parseErr);
    return new Response(JSON.stringify({ error: "Invalid request format" }), { 
      status: 400, 
      headers 
    });
  }

  try {
    const { recipe, userRequest, modificationHistory = [], user_id } = requestPayload;

    // validate input
    try {
      validateRecipe(recipe);
      if (!userRequest || typeof userRequest !== 'string' || userRequest.trim() === '') {
        throw new Error('Missing or empty userRequest. Please provide a modification request string.');
      }
    } catch (valErr) {
      console.error("Validation error:", valErr);
      return new Response(JSON.stringify({ error: valErr.message }), { status: 400, headers });
    }

    // build LangChain call
    const chain = createLangChainSequence();
    const input = `
      Original Recipe: ${JSON.stringify(recipe)}
      Modification Request: ${userRequest}
      
      Return a complete JSON object containing the entire recipe with your modifications applied.
      Include every field from the original recipe, with your modifications applied.
      IMPORTANT: If adding new ingredients, you MUST provide DETAILED cooking instructions for them,
      not just placeholders like "Add bacon cooking steps".
    `;
    const history = [
      ...modificationHistory.map(e => ({ role: "human", content: e.request })),
      ...modificationHistory.map(e => ({ role: "ai", content: JSON.stringify(e.response) }))
    ];

    console.log("Calling AI model with history length:", history.length);

    // call LLM with circuit breaker + retry
    let result: any;
    try {
      result = await openAICircuit.execute(() =>
        withRetry(() => chain.invoke({ input, history }), 3, 500)
      );
      console.log("AI returned result with keys:", Object.keys(result));
    } catch (llmErr) {
      const msg = llmErr.message.includes("Circuit is open")
        ? { error: "Service unavailable, too many failures" }
        : llmErr.message.includes("timeout")
          ? { error: "AI request timed out" }
          : { error: "AI generation failed", details: llmErr.message };
      
      console.error("LLM error:", llmErr);
      return new Response(JSON.stringify(msg), { status: 503, headers });
    }

    // Zod-validate AI output
    let parsed: any;
    try {
      parsed = recipeModificationsSchema.parse(result);
      console.log("Parsed recipe with updated title:", parsed.recipe?.title);
    } catch (parseErr) {
      console.error("Schema parsing error:", parseErr);
      return new Response(
        JSON.stringify({
          error: "Invalid AI response format",
          details: (parseErr as Error).message
        }),
        { status: 422, headers }
      );
    }

    // Validate instructions
    if (parsed.recipe?.instructions) {
      const validInstructions = validateInstructions(parsed.recipe.instructions);
      if (!validInstructions) {
        return new Response(
          JSON.stringify({
            error: "Invalid recipe instructions",
            details: "Recipe instructions contain placeholders or are too short. Please provide detailed cooking steps."
          }),
          { status: 422, headers }
        );
      }
    }

    // Get latest version number
    let latestVersionNumber = 0;
    let versionData = null;
    
    try {
      latestVersionNumber = await getLatestVersionNumber(recipe.id);
      const newVersionNumber = latestVersionNumber + 1;
      
      // Add version info to recipe
      const modifiedRecipe = parsed.recipe;
      if (!modifiedRecipe.version_info) {
        modifiedRecipe.version_info = {
          version_number: newVersionNumber,
          parent_version_id: recipe.version_id || null,
          modification_reason: userRequest
        };
      }
      
      console.log("Creating version:", newVersionNumber, "for recipe:", recipe.id);
      
      // Ensure recipe ID is preserved
      modifiedRecipe.id = recipe.id;
      
      // Store the version
      versionData = await storeRecipeVersion({
        recipeId: recipe.id,
        parentVersionId: recipe.version_id || null,
        versionNumber: newVersionNumber,
        userId: user_id,
        modificationRequest: userRequest,
        recipeData: modifiedRecipe
      });
      
      if (versionData) {
        modifiedRecipe.version_id = versionData.version_id;
        console.log("Version created successfully with ID:", versionData.version_id);
      }
    } catch (versionError) {
      console.error("Version handling error:", versionError);
      // Continue despite version handling error
    }

    // Write chat record
    const SUPA_URL = Deno.env.get("SUPABASE_URL");
    const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPA_URL || !SUPA_KEY) {
      console.error("Missing Supabase env vars");
    } else {
      try {
        const sb = createClient(SUPA_URL, SUPA_KEY, {
          global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
        });
        const chatResult = await sb.from("recipe_chats").insert({
          recipe_id: recipe.id,
          user_message: userRequest,
          ai_response: parsed.textResponse,
          changes_suggested: true,
          version_id: parsed.recipe.version_id, // Link to version
          source_type: "modification"
        });
        
        if (chatResult.error) {
          console.error("Error saving chat record:", chatResult.error);
        } else {
          console.log("Chat record saved successfully");
        }
      } catch (dbErr) {
        console.error("DB insert failed", dbErr);
      }
    }

    // Add version ID to response
    const response = {
      ...parsed,
      recipe: parsed.recipe
    };

    // Final success response
    console.log("Returning successful response with recipe ID:", response.recipe.id);
    return new Response(JSON.stringify(response), { status: 200, headers });
  } catch (err) {
    console.error("Unexpected error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers
    });
  }
});

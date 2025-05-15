
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";
import { generateRecipeWithOpenAI } from "../generate-quick-recipe/openai-client.ts";
import { buildModificationPrompt } from "./prompt-builder.ts";

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

// === validate incoming recipe ===
function validateRecipe(recipe: any) {
  if (!recipe?.title) throw new Error("Missing recipe.title");
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0)
    throw new Error("Must have at least one ingredient");
  if (!Array.isArray(recipe.steps) && !Array.isArray(recipe.instructions))
    throw new Error("Must have steps or instructions");
  
  // Validate recipe ID exists
  if (!recipe.id) throw new Error("Recipe ID is required");
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

  try {
    const { recipe, userRequest, modificationHistory = [] } = await req.json();

    // validate input
    try {
      validateRecipe(recipe);
    } catch (vall) {
      return new Response(JSON.stringify({ error: vall.message }), { status: 400, headers });
    }

    // Get OpenAI API key
    const key = Deno.env.get("OPENAI_API_KEY");
    if (!key) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY missing" }), 
        { status: 500, headers }
      );
    }

    // Build prompt using the recipe generation style but for modifications
    const prompt = buildModificationPrompt({
      recipe,
      userRequest,
      modificationHistory
    });

    // call OpenAI with circuit breaker + retry
    let result: any;
    try {
      result = await openAICircuit.execute(() =>
        withRetry(async () => {
          // Use the same OpenAI client as the recipe generation pipeline
          return await generateRecipeWithOpenAI(
            key, 
            prompt, 
            { 
              servings: recipe.servings || 2,
              debugInfo: "recipe-modification", 
              embeddingModel: "text-embedding-ada-002"
            },
            headers,
            "recipe-modification"
          );
        }, 3, 500)
      );
    } catch (llmErr) {
      const msg = llmErr.message.includes("Circuit is open")
        ? { error: "Service unavailable, too many failures" }
        : llmErr.message.includes("timeout")
          ? { error: "AI request timed out" }
          : { error: "AI generation failed" };
      return new Response(JSON.stringify(msg), { status: 503, headers });
    }

    // Handle OpenAI response error
    if (result.status && result.status !== 200) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate recipe modification",
          details: result.error || "Unknown error" 
        }),
        { status: result.status || 500, headers }
      );
    }

    // Add metadata to track that this is a modification
    result.isModification = true;
    result.modificationRequest = userRequest;
    result.modificationHistory = modificationHistory;
    result.originalRecipeId = recipe.id;

    // Save modification request to database
    const SUPA_URL = Deno.env.get("SUPABASE_URL");
    const SUPA_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (SUPA_URL && SUPA_KEY) {
      try {
        const sb = createClient(SUPA_URL, SUPA_KEY, {
          global: { headers: { Authorization: `Bearer ${SUPA_KEY}` } }
        });
        
        // Ensure we have valid recipe ID before saving to database
        if (!recipe.id) {
          throw new Error("Cannot save chat: Recipe ID is missing");
        }
        
        const chatData = {
          recipe_id: recipe.id,
          user_message: userRequest,
          ai_response: JSON.stringify({
            textResponse: `Modified recipe: ${result.title}`,
            changes: {
              title: result.title !== recipe.title ? result.title : undefined,
              ingredients: result.ingredients && result.ingredients.length > 0 ? result.ingredients : undefined,
              steps: result.steps && result.steps.length > 0 ? result.steps : undefined,
              instructions: result.instructions && result.instructions.length > 0 ? result.instructions : undefined,
            }
          }),
          source_type: "modification"
        };
        
        await sb.from("recipe_chats").insert(chatData);
      } catch (dbErr) {
        console.error("DB insert failed", dbErr);
      }
    }

    // Create a backwards-compatible response structure
    const response = {
      ...result,
      textResponse: `I've modified the recipe "${recipe.title}" to "${result.title}" based on your request.`,
      reasoning: result.description || "Recipe modified based on your instructions.",
      modifications: {
        title: result.title,
        description: result.description,
        ingredients: result.ingredients.map((ingredient: any, i: number) => ({
          original: recipe.ingredients[i]?.item,
          modified: ingredient.item,
          reason: "Modified based on request"
        })),
        steps: result.steps.map((step: string, i: number) => ({
          original: recipe.steps && i < recipe.steps.length ? recipe.steps[i] : undefined,
          modified: step,
          reason: "Modified based on request"
        })),
        cookingTip: result.cookingTip
      },
      nutritionImpact: {
        assessment: "Recipe nutrition has been recalculated." 
      }
    };

    // return success with full recipe and backwards-compatible structure
    return new Response(JSON.stringify(response), { status: 200, headers });
  } catch (err) {
    console.error("Unexpected error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers
    });
  }
});

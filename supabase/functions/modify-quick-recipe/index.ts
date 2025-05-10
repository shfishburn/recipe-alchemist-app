
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ChatOpenAI } from "https://esm.sh/langchain/chat_models/openai";
import { StructuredOutputParser } from "https://esm.sh/langchain/output_parsers";
import { RunnableSequence } from "https://esm.sh/@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "https://esm.sh/@langchain/core/prompts";
import { z } from "https://esm.sh/zod@3.21.4";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the schema for recipe modifications using Zod
const recipeModificationsSchema = z.object({
  modifications: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
      action: z.enum(["add", "remove", "modify"]),
      originalIndex: z.number().optional(),
      item: z.string(),
      qty_metric: z.number().optional(),
      unit_metric: z.string().optional(),
      qty_imperial: z.number().optional(),
      unit_imperial: z.string().optional(),
      notes: z.string().optional(),
    })).optional(),
    steps: z.array(z.object({
      action: z.enum(["add", "remove", "modify"]),
      originalIndex: z.number().optional(),
      content: z.string(),
    })).optional(),
  }),
  nutritionImpact: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    summary: z.string(),
  }),
  reasoning: z.string(),
});

// Retry mechanism with exponential backoff
async function withRetry(fn, maxRetries = 3, initialDelay = 500) {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries > maxRetries) {
        console.error(`Failed after ${maxRetries} retries:`, error);
        throw error;
      }
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Circuit breaker to prevent cascading failures
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private isOpen = false;

  constructor(
    private maxFailures = 5,
    private resetTimeout = 30000 // 30 seconds
  ) {}

  async execute(fn) {
    if (this.isOpen) {
      if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
        this.reset();
      } else {
        throw new Error("Circuit is open, request rejected");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.maxFailures) {
      this.isOpen = true;
    }
  }

  private reset() {
    this.failureCount = 0;
    this.isOpen = false;
    this.lastFailureTime = null;
  }
}

// Create circuit breaker instance
const openAICircuitBreaker = new CircuitBreaker();

// Initialize the OpenAI model
function createLangChainSequence() {
  const parser = StructuredOutputParser.fromZodSchema(recipeModificationsSchema);

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error("OpenAI API key not found");
  }
  
  // Initialize with more robust parameters
  const model = new ChatOpenAI({ 
    openAIApiKey,
    modelName: "gpt-4o",
    temperature: 0.2,
    timeout: 60000, // 60 second timeout
    maxRetries: 3,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a culinary nutrition expert who helps users modify recipes to meet their goals.
    
    When modifying recipes:
    1. Always maintain culinary integrity - changes should make sense and taste good
    2. Consider the chemistry of cooking when making substitutions
    3. Accurately calculate the nutrition impact of any changes
    4. Provide specific quantities and units for ingredients
    5. Explain the reasoning behind your modifications
    
    IMPORTANT: You must respond with a valid JSON object matching the expected output format.
    Your final response must ONLY include this JSON object, nothing else.`],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
    ["human", "Respond ONLY with a valid JSON object. Include your explanation in the 'reasoning' field."],
  ]);

  return RunnableSequence.from([
    {
      input: (request) => request.input,
      history: (request) => request.history || [],
    },
    prompt,
    model,
    parser,
  ]);
}

// Validate recipe structure and prevent data loss
function validateRecipe(recipe) {
  if (!recipe) {
    throw new Error("Recipe is required");
  }
  
  // Check essential fields
  if (!recipe.title) {
    throw new Error("Recipe title is missing");
  }
  
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    throw new Error("Recipe must have ingredients");
  }
  
  // Ensure we have either steps or instructions
  const hasSteps = Array.isArray(recipe.steps) && recipe.steps.length > 0;
  const hasInstructions = Array.isArray(recipe.instructions) && recipe.instructions.length > 0;
  
  if (!hasSteps && !hasInstructions) {
    throw new Error("Recipe must have steps or instructions");
  }
  
  return true;
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    console.log("Starting recipe modification request", { timestamp: new Date().toISOString() });
    
    const requestData = await req.json();
    const { recipe, userRequest, modificationHistory = [] } = requestData;
    
    console.log("Validating recipe...");
    try {
      validateRecipe(recipe);
    } catch (validationError) {
      console.error("Recipe validation failed:", validationError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid recipe data", 
          details: validationError.message 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Process the request using our langchain sequence with circuit breaker
    const runnable = createLangChainSequence();
    
    // Structure the input with recipe details and modification history for context
    const input = `
      Recipe to modify: ${JSON.stringify(recipe)}
      
      User request: ${userRequest}
      
      Current nutrition information: ${JSON.stringify(recipe.nutrition || {})}
    `;

    // Create history context from previous modifications if available
    const history = modificationHistory.map(entry => ({
      role: "human",
      content: entry.request,
    })).concat(modificationHistory.map(entry => ({
      role: "ai",
      content: JSON.stringify(entry.response),
    })));

    // Execute with circuit breaker and retry mechanism
    let result;
    try {
      result = await openAICircuitBreaker.execute(async () => {
        return await withRetry(() => runnable.invoke({
          input,
          history,
        }));
      });
      
      console.log("Successfully generated recipe modifications");
    } catch (error) {
      console.error("Error generating recipe modifications:", error);
      
      // Provide a specific, actionable error message based on error type
      let errorMessage = "Failed to generate recipe modifications";
      let errorDetails = error.message;
      let statusCode = 500;
      
      if (error.message.includes("Circuit is open")) {
        errorMessage = "Service temporarily unavailable";
        errorDetails = "Too many failures detected. Please try again later.";
        statusCode = 503;
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out";
        errorDetails = "The modification request took too long to process. Try a simpler request.";
        statusCode = 504;
      } else if (error.message.includes("OpenAI API key not found")) {
        errorMessage = "Configuration error";
        errorDetails = "The server is missing required credentials.";
        statusCode = 500;
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage, 
          details: errorDetails
        }),
        { 
          status: statusCode, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const processingTime = Date.now() - startTime;
    console.log("Recipe modification completed", { 
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

    // Return the result
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Unexpected error in modify-quick-recipe function:", error);
    
    return new Response(
      JSON.stringify({
        error: "Unexpected error occurred",
        details: error.message || "Unknown error"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

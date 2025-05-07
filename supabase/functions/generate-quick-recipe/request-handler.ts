
import { corsHeaders } from "../_shared/cors.ts";
import { validateRequestBody } from "./validation.ts";
import { generateRecipeWithOpenAI } from "./openai-client.ts";
import { buildOpenAIPrompt } from "./prompt-builder.ts";
import { processRequestParams } from "./request-processor.ts";

// Valid cuisine categories - should match database enum
const VALID_CUISINE_CATEGORIES = [
  "Global", 
  "Regional American", 
  "European", 
  "Asian", 
  "Dietary Styles", 
  "Middle Eastern"
];

// Main request handler function
export async function handleRequest(req: Request, debugInfo: string, embeddingModel: string = "text-embedding-ada-002"): Promise<Response> {
  // Check content type
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Invalid content type:", contentType);
    return new Response(
      JSON.stringify({ 
        error: "Content-Type must be application/json",
        debugInfo: debugInfo
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Get OpenAI API key with better error handling
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key is not configured",
          details: "The OPENAI_API_KEY environment variable is missing or empty",
          debugInfo: debugInfo
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Diagnostic log for API key (redacted)
    console.log(`API key configured: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
    
    // Parse the request body - ONLY ONCE, directly to JSON
    let requestBody;
    try {
      // This is the key fix: Parse JSON directly instead of consuming the body as text first
      requestBody = await req.json();
      console.log("Parsed request body:", JSON.stringify(requestBody).substring(0, 200) + "...");
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body", 
          details: parseError instanceof Error ? parseError.message : String(parseError),
          debugInfo: debugInfo
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!requestBody) {
      return new Response(
        JSON.stringify({ 
          error: "Empty request body after parsing", 
          debugInfo: debugInfo
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Process request parameters
    const { 
      processedParams,
      error: paramError 
    } = processRequestParams(requestBody, debugInfo);
    
    if (paramError) {
      return paramError;
    }
    
    // Add embedding model to the params
    processedParams.embeddingModel = embeddingModel;
    
    // Build the prompt for OpenAI
    const prompt = buildOpenAIPrompt(processedParams);
    
    // Log the final constructed prompt for debugging
    console.log("Final prompt construction - length:", prompt.length);
    console.log("Final prompt snippet (first 300 chars):", prompt.substring(0, 300));
    
    // Generate recipe using OpenAI
    const response = await generateRecipeWithOpenAI(apiKey, prompt, processedParams, corsHeaders, debugInfo);
    
    // Validate cuisine_category in response if it's a successful response
    if (response.status === 200) {
      try {
        // Clone the response so we can read the body
        const clonedResponse = response.clone();
        const responseBody = await clonedResponse.json();
        
        // Check if the cuisine category is valid
        if (responseBody && responseBody.cuisine_category) {
          if (!VALID_CUISINE_CATEGORIES.includes(responseBody.cuisine_category)) {
            console.warn(`Invalid cuisine_category '${responseBody.cuisine_category}' returned from OpenAI. Setting to 'Global'.`);
            // Modify the response to set a valid category
            responseBody.cuisine_category = "Global";
            
            // Return the modified response
            return new Response(
              JSON.stringify(responseBody),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      } catch (validationError) {
        console.error("Error validating cuisine category:", validationError);
        // We'll still return the original response even if validation fails
      }
    }
    
    return response;
    
  } catch (error: any) {
    console.error("Quick recipe generation error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
        details: error.stack || "No stack trace available",
        debugInfo: debugInfo
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
}

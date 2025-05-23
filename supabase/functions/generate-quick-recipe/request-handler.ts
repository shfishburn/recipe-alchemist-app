
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";
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

// Main request handler function - now accepts the parsed request body directly
export async function handleRequest(
  req: Request, 
  requestBody: any, 
  debugInfo: string, 
  embeddingModel: string = "text-embedding-ada-002"
): Promise<Response> {
  // Check content type
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Invalid content type:", contentType);
    return new Response(
      JSON.stringify({ 
        error: "Content-Type must be application/json",
        debugInfo: debugInfo
      }),
      { status: 400, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
    );
  }

  try {
    // Get OpenAI API key with better error handling
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({ 
          error: "Our recipe AI service is temporarily unavailable",
          details: "Missing API configuration - please try again later",
          debugInfo: debugInfo
        }),
        { status: 500, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
      );
    }
    
    // Diagnostic log for API key (redacted)
    console.log(`API key configured: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
    
    // We already have the parsed request body, so no need to parse it again
    if (!requestBody) {
      console.error("Empty request body after parsing");
      return new Response(
        JSON.stringify({ 
          error: "Empty request body after parsing", 
          debugInfo: debugInfo
        }),
        { status: 400, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
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
    
    // Generate recipe using OpenAI - update to use dynamic CORS headers
    const response = await generateRecipeWithOpenAI(apiKey, prompt, processedParams, getCorsHeadersWithOrigin(req), debugInfo);
    
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
            
            // Return the modified response with dynamic CORS headers
            return new Response(
              JSON.stringify(responseBody),
              { status: 200, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
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
        error: "Recipe generation service error - please try again",
        details: error.message || "An unexpected error occurred",
        debugInfo: debugInfo
      }),
      { status: 500, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } },
    );
  }
}

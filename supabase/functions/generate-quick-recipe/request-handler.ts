
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
    
    // Validate response structure
    if (response.status === 200) {
      try {
        // Clone the response so we can read the body
        const clonedResponse = response.clone();
        const responseText = await clonedResponse.text();
        
        try {
          const responseBody = JSON.parse(responseText);
          
          // Validate minimum structure requirements
          const isValid = validateResponseStructure(responseBody);
          
          if (!isValid) {
            console.error("Invalid response structure:", responseBody);
            // Create a valid response with error information
            return new Response(
              JSON.stringify({
                title: "Recipe Structure Error",
                description: "The recipe generation service returned an invalid structure",
                error_message: "Invalid recipe structure received",
                isError: true,
                ingredients: [],
                steps: ["The recipe generation system encountered a structure error. Please try again."]
              }),
              { status: 200, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
            );
          }
          
          // If valid, return the original response
          return response;
        } catch (jsonError) {
          console.error("Error parsing response JSON:", jsonError);
          // Handle non-JSON response
          return new Response(
            JSON.stringify({
              title: "Recipe Format Error",
              description: "The recipe generation service returned an invalid format",
              error_message: "Invalid response format received",
              isError: true,
              ingredients: [],
              steps: ["The recipe generation system encountered a format error. Please try again."]
            }),
            { status: 200, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
          );
        }
      } catch (validationError) {
        console.error("Error validating response:", validationError);
        // If validation fails, return the original response
        return response;
      }
    }
    
    // For non-200 responses, just return them as is
    return response;
    
  } catch (error) {
    console.error("Error in handleRequest:", error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred in the recipe generation service",
        details: error instanceof Error ? error.message : String(error),
        debugInfo: debugInfo
      }),
      { status: 500, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
    );
  }
}

// Helper function to validate response structure
function validateResponseStructure(response: any): boolean {
  // Check for standard error response format
  if (response.error || response.isError === true) {
    // Already an error response, so it's "valid" structurally
    return true;
  }
  
  // Check for minimum recipe structure
  const hasTitle = typeof response.title === 'string';
  const hasIngredients = Array.isArray(response.ingredients);
  const hasSteps = Array.isArray(response.steps) || Array.isArray(response.instructions);
  
  // Special case: single ingredient returned instead of a recipe
  if (!hasTitle && !hasSteps && response.item && (response.qty_imperial !== undefined || response.qty_metric !== undefined)) {
    // This is a single ingredient, not a complete recipe - still considered valid
    // The client will handle this special case
    return true;
  }
  
  // Complete recipe must have title, ingredients, and steps
  return hasTitle && hasIngredients && hasSteps;
}

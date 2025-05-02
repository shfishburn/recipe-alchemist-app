
import { corsHeaders } from "../_shared/cors.ts";
import { validateRequestBody } from "./validation.ts";
import { generateRecipeWithOpenAI } from "./openai-client.ts";
import { buildOpenAIPrompt } from "./prompt-builder.ts";
import { processRequestParams } from "./request-processor.ts";

// Main request handler function
export async function handleRequest(req: Request, debugInfo: string): Promise<Response> {
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
    
    // Parse and validate request body
    const { requestBody, error: parseError } = await validateRequestBody(req);
    if (parseError) {
      return parseError;
    }
    
    // Process request parameters
    const { 
      processedParams,
      error: paramError 
    } = processRequestParams(requestBody, debugInfo);
    
    if (paramError) {
      return paramError;
    }
    
    // Build the prompt for OpenAI
    const prompt = buildOpenAIPrompt(processedParams);
    
    // Log the final constructed prompt for debugging
    console.log("Final prompt construction - length:", prompt.length);
    console.log("Final prompt snippet (first 300 chars):", prompt.substring(0, 300));
    
    // Generate recipe using OpenAI
    return await generateRecipeWithOpenAI(apiKey, prompt, processedParams, corsHeaders, debugInfo);
    
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

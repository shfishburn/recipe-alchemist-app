import { corsHeaders } from "../_shared/cors.ts";

// This function is now deprecated as we handle validation directly in request-handler.ts
// We're keeping it for compatibility but it no longer validates the body
export async function validateRequestBody(req: Request): Promise<{ requestBody?: any, error?: Response }> {
  try {
    // We don't need to validate here anymore since we do it in the handler
    // Just return an empty object to maintain function signature compatibility
    return { requestBody: {} };
  } catch (parseError) {
    console.error("Error parsing request body in validation.ts:", parseError);
    return { 
      error: new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body", 
          details: parseError.message,
          debugInfo: "validation"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}

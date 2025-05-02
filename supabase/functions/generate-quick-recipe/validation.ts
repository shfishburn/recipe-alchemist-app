
import { corsHeaders } from "../_shared/cors.ts";

// Validate and parse the request body
export async function validateRequestBody(req: Request): Promise<{ requestBody?: any, error?: Response }> {
  try {
    // Log the request details
    console.log("Request headers:", [...req.headers.entries()].map(([k, v]) => `${k}: ${v}`).join(', '));
    console.log("Request method:", req.method);
    
    // Get the request body as text first for debugging
    const requestText = await req.text();
    console.log("Raw request body:", requestText.length > 0 ? 
      `${requestText.substring(0, 200)}... (${requestText.length} chars)` : 
      "EMPTY REQUEST BODY");
    
    if (!requestText || requestText.trim() === "") {
      console.error("Empty request body received");
      return { 
        error: new Response(
          JSON.stringify({ 
            error: "Empty request body", 
            debugInfo: "validation"
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    // Parse the request text into JSON
    const requestBody = JSON.parse(requestText);
    console.log("Parsed request body:", JSON.stringify(requestBody).substring(0, 200) + "...");
    
    if (!requestBody) {
      return { 
        error: new Response(
          JSON.stringify({ 
            error: "Empty request body after parsing", 
            debugInfo: "validation"
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    return { requestBody };
  } catch (parseError) {
    console.error("Error parsing request body:", parseError);
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

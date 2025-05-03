
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleRequest } from "./request-handler.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Main entry point for the edge function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get debug info from headers if present
    const debugInfo = req.headers.get("x-debug-info") || "no-debug-info";
    console.log(`Request received with debug info: ${debugInfo}`);
    
    // Extract embedding model from request body instead of header
    const requestBody = await req.json();
    const embeddingModel = requestBody.embeddingModel || "text-embedding-ada-002";
    console.log(`Using embedding model: ${embeddingModel}`);
    
    return await handleRequest(req, debugInfo, embeddingModel);
  } catch (err) {
    console.error("Quick recipe generation error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Unexpected error",
        details: err.stack || "No stack trace available",
        debugInfo: "error-handler"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

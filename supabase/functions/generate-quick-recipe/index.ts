
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
    
    // Add more request information for debugging
    console.log(`Request method: ${req.method}`);
    console.log(`Request content-type: ${req.headers.get("content-type")}`);
    console.log(`Request authorization: ${req.headers.get("authorization") ? "Present" : "Missing"}`);
    
    // Log all headers for comprehensive debugging
    console.log("All request headers:");
    for (const [key, value] of req.headers.entries()) {
      console.log(`  ${key}: ${key === "authorization" ? "Bearer ..." : value}`);
    }
    
    // Try to clone and read the request body to check if it's empty
    try {
      const clonedReq = req.clone();
      const bodyText = await clonedReq.text();
      console.log(`Request body length: ${bodyText.length}`);
      if (bodyText.length > 0) {
        console.log(`Request body preview: ${bodyText.substring(0, 100)}...`);
      } else {
        console.log("WARNING: Empty request body received!");
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
    }
    
    // Extract embedding model from request body
    const embeddingModel = "text-embedding-ada-002"; // Default model
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

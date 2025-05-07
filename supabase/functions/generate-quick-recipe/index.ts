
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleRequest } from "./request-handler.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Main entry point for the edge function
serve(async (req) => {
  console.log(`Edge function received request: ${req.method} ${req.url}`);
  console.log(`Origin header: ${req.headers.get("Origin") || "no origin"}`);
  console.log(`Host header: ${req.headers.get("Host") || "no host"}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin, x-debug-info',
        'Access-Control-Max-Age': '86400', // 24 hours caching for preflight
      } 
    });
  }
  
  try {
    // Get debug info from headers if present
    const debugInfo = req.headers.get("x-debug-info") || "no-debug-info";
    const origin = req.headers.get("Origin") || "unknown-origin";
    console.log(`Request received with debug info: ${debugInfo}, from origin: ${origin}`);
    
    // Log request details for debugging
    console.log(`Request method: ${req.method}`);
    console.log(`Request headers: ${JSON.stringify(Object.fromEntries(req.headers))}`);
    
    // Extract embedding model from request body
    let embeddingModel = "text-embedding-ada-002"; // Default model
    try {
      const reqClone = req.clone();
      const body = await reqClone.json();
      if (body && body.embeddingModel) {
        embeddingModel = body.embeddingModel;
      }
      console.log("Successfully parsed request body");
    } catch (e) {
      console.warn("Could not parse request body to extract embeddingModel", e);
    }
    console.log(`Using embedding model: ${embeddingModel}`);
    
    return await handleRequest(req, debugInfo, embeddingModel);
  } catch (err) {
    console.error("Quick recipe generation error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Unexpected error",
        details: err.stack || "No stack trace available",
        debugInfo: "error-handler",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" // Ensure this header is always set
        } 
      },
    );
  }
});

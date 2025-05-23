
/*
 * DO NOT MODIFY THIS FILE DIRECTLY
 * Last updated: 2025-05-12T18:00:00Z
 * 
 * This file manages the recipe generation edge function with proper CORS handling.
 * It uses dynamic origin detection for proper cross-origin resource sharing.
 * Any changes should be carefully tested to ensure proper API connectivity.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleRequest } from "./request-handler.ts";
import { getCorsHeadersWithOrigin } from "../_shared/cors.ts";

// Main entry point for the edge function
serve(async (req) => {
  console.log("Edge function called: generate-quick-recipe");
  
  // Handle CORS preflight requests with origin-aware headers
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { 
      headers: getCorsHeadersWithOrigin(req) 
    });
  }
  
  try {
    // Get debug info from headers if present
    const debugInfo = req.headers.get("x-debug-info") || "no-debug-info";
    console.log(`Request received with debug info: ${debugInfo}`);
    
    // Read the request body ONCE and parse it
    let requestBody;
    try {
      const bodyText = await req.text();
      
      if (!bodyText || bodyText.trim() === '') {
        console.log("Raw request body: EMPTY REQUEST BODY");
        console.error("Empty request body received");
        return new Response(
          JSON.stringify({
            error: "Empty request body",
            details: "Request body is empty or missing"
          }),
          { 
            status: 400, 
            headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
          }
        );
      }
      
      try {
        requestBody = JSON.parse(bodyText);
        console.log("Parsed request body:", JSON.stringify(requestBody).substring(0, 100) + "...");
      } catch (parseError) {
        console.error("Error parsing request body:", parseError);
        return new Response(
          JSON.stringify({
            error: "Invalid request format: Could not parse JSON body",
            details: String(parseError)
          }),
          { 
            status: 400, 
            headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
          }
        );
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      return new Response(
        JSON.stringify({
          error: "Could not read request body",
          details: String(bodyError)
        }),
        { 
          status: 400, 
          headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
        }
      );
    }
    
    // Check if OpenAI API key is available
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OPENAI_API_KEY environment variable not set");
      return new Response(
        JSON.stringify({
          error: "API configuration error",
          details: "OpenAI API key is not configured"
        }),
        { 
          status: 500, 
          headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } 
        }
      );
    }
    
    // Extract embedding model from request body
    const embeddingModel = requestBody?.embeddingModel || "text-embedding-ada-002"; // Default model
    console.log(`Using embedding model: ${embeddingModel}`);
    
    // Pass the parsed body to handleRequest instead of the original request
    return await handleRequest(req, requestBody, debugInfo, embeddingModel);
  } catch (err) {
    console.error("Quick recipe generation error:", err);
    
    // Create user-friendly error message
    let errorMessage = "Unexpected error occurred while generating recipe";
    let errorDetails = String(err);
    
    if (err instanceof Error) {
      errorMessage = err.message || errorMessage;
      errorDetails = err.stack || errorDetails;
    }
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails,
        debugInfo: "error-handler"
      }),
      { status: 500, headers: { ...getCorsHeadersWithOrigin(req), "Content-Type": "application/json" } }
    );
  }
});

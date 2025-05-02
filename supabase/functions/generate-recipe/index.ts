
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.0.0";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * @deprecated This function is deprecated. Please use the generate-quick-recipe endpoint instead.
 * This implementation will forward all requests to generate-quick-recipe for consistency.
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('DEPRECATED: generate-recipe is being called. This endpoint will be removed in a future update.');
    console.log('Redirecting request to generate-quick-recipe endpoint...');
    
    // Get the request data
    const requestData = await req.json();
    
    // Modify the request format to match generate-quick-recipe
    const quickRecipeRequest = {
      cuisine: requestData.cuisine,
      dietary: requestData.dietary,
      mainIngredient: requestData.recipeRequest || "Chef's choice",
      servings: requestData.servings || 4,
      maxCalories: requestData.maxCalories
    };
    
    // Forward the request to the generate-quick-recipe function
    const response = await fetch(
      `${req.url.split('/generate-recipe')[0]}/generate-quick-recipe`,
      {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(quickRecipeRequest)
      }
    );
    
    // Get the response from the quick-recipe endpoint
    const quickRecipeData = await response.json();
    
    console.log('Successfully forwarded request to generate-quick-recipe');
    
    return new Response(JSON.stringify(quickRecipeData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Recipe generation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

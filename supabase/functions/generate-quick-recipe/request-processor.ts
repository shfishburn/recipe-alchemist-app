
import { corsHeaders } from "../_shared/cors.ts";

// Process request parameters
export function processRequestParams(requestBody: any, debugInfo: string): { 
  processedParams?: any, 
  error?: Response 
} {
  try {
    // Extract and validate parameters
    const { 
      cuisine = "Any", 
      dietary = [], 
      mainIngredient = "Chef's choice", 
      servings = 2,
      maxCalories,
      flavorTags = []
    } = requestBody;
    
    // Validate required parameters
    if (!mainIngredient) {
      console.error("Missing main ingredient");
      return { 
        error: new Response(
          JSON.stringify({ 
            error: "Main ingredient is required",
            debugInfo: debugInfo 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }
    
    // Diagnostic log all inputs
    console.log("Recipe inputs:", { 
      mainIngredient, 
      cuisine: typeof cuisine === 'string' ? cuisine : JSON.stringify(cuisine), 
      dietary: typeof dietary === 'string' ? dietary : JSON.stringify(dietary),
      servings,
      maxCalories: maxCalories || "not specified",
      flavorTags: typeof flavorTags === 'string' ? flavorTags : JSON.stringify(flavorTags)
    });
    
    // Improved handling of cuisine values
    const processCuisine = typeof cuisine === 'string' 
      ? (cuisine.toLowerCase() === 'any' || cuisine === '') 
        ? ["Any"] // Handle special cases directly
        : cuisine.split(',').map(c => c.trim()).filter(Boolean)
      : Array.isArray(cuisine) ? cuisine : ["Any"];
      
    // Improved handling of dietary values
    const processDietary = typeof dietary === 'string' 
      ? (dietary.toLowerCase() === 'any' || dietary === '' || dietary.toLowerCase() === 'none') 
        ? [] // Handle special cases directly - empty array for no restrictions
        : dietary.split(',').map(d => d.trim()).filter(Boolean)
      : Array.isArray(dietary) ? dietary : [];
      
    // Improved handling of flavor tags
    const processFlavorTags = typeof flavorTags === 'string' 
      ? (flavorTags.toLowerCase() === 'any' || flavorTags === '') 
        ? ["Chef's choice"] 
        : flavorTags.split(',').map(t => t.trim()).filter(Boolean)
      : Array.isArray(flavorTags) ? flavorTags : ["Chef's choice"];
    
    // Log processed values for debugging
    console.log("Processed values:", {
      processCuisine,
      processDietary,
      processFlavorTags
    });
    
    // Escape user inputs to prevent prompt-injection
    const safeCuisine = processCuisine.map(c => JSON.stringify(c).slice(1, -1)).join(", ") || "Any";
    const safeMain = JSON.stringify(mainIngredient).slice(1, -1);
    const safeDiet = processDietary.length
      ? processDietary.map((d) => JSON.stringify(d).slice(1, -1)).join(", ")
      : "None";
    const safeServings = servings || 2;
    const safeTags = processFlavorTags.length
      ? processFlavorTags.map((t) => JSON.stringify(t).slice(1, -1)).join(", ")
      : "Chef's choice";
    
    // Generate a unique ID to prevent prompt caching
    const uniqueId = Date.now().toString();
    
    return { 
      processedParams: {
        safeCuisine,
        safeMain,
        safeDiet,
        safeServings,
        safeTags,
        maxCalories,
        uniqueId,
        // Add this line to pass the main ingredient as an ingredients array
        // This ensures compatibility with the buildOpenAIPrompt function
        ingredients: [safeMain]
      }
    };
  } catch (error) {
    console.error("Error processing request parameters:", error);
    return {
      error: new Response(
        JSON.stringify({
          error: "Error processing request parameters",
          details: error.message,
          debugInfo: debugInfo
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}

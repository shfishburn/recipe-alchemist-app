
import { Ingredient, QuickRecipe } from "@/types/quick-recipe";

// Function to normalize recipe response from edge function
export const normalizeRecipeResponse = (data: any): QuickRecipe => {
  console.log("Normalizing recipe response:", data);
  
  // Handle completely empty data
  if (!data) {
    console.error("Empty recipe data received");
    return createErrorRecipe("Empty recipe data received");
  }
  
  // Check for error flags in the original data and preserve them
  const hasError = data.isError === true || data.error || data.error_message;
  
  // If data has error flags, return it with minimal processing
  if (hasError) {
    console.warn("Recipe data contains error flags:", data.error || data.error_message);
    return {
      title: data.title || "Recipe Generation Issue",
      description: data.description || data.error || data.error_message || "An error occurred generating your recipe",
      ingredients: data.ingredients || [{
        item: "Error generating ingredients",
        qty_metric: 0,
        unit_metric: "",
        qty_imperial: 0,
        unit_imperial: ""
      }],
      steps: data.steps || ["There was an issue creating your recipe."],
      instructions: data.instructions || data.steps || ["There was an issue creating your recipe."],
      servings: data.servings || 2,
      isError: true,
      error_message: data.error_message || data.error || "Unknown error occurred"
    };
  }

  // Special case: If data looks like a single ingredient rather than a recipe (common OpenAI error)
  if (data.item && data.qty_imperial && !data.title) {
    console.warn("Received single ingredient instead of complete recipe:", data);
    return createErrorRecipe("Received incomplete recipe data", [data]);
  }
  
  // Log validation issues but don't throw errors
  if (!data.title || !data.ingredients) {
    console.warn("Recipe data missing required fields:", data);
  }
  
  // Handle different response formats
  const ingredients = normalizeIngredients(data.ingredients);
  
  // Always ensure steps and instructions exist
  const steps = data.steps || data.instructions || ["Recipe steps could not be generated"];
  const instructions = data.instructions || data.steps || ["Recipe instructions could not be generated"];
  
  // Normalize the recipe structure with fallbacks
  return {
    title: data.title || "Unnamed Recipe",
    tagline: data.tagline || data.description || "",
    description: data.description || "",
    ingredients: ingredients,
    // Handle different property names for instructions/steps
    instructions: instructions,
    steps: steps,
    servings: data.servings || 4,
    // Handle different property names for prep/cook time
    prep_time_min: data.prep_time_min || data.prepTime || 0,
    cook_time_min: data.cook_time_min || data.cookTime || 0,
    prepTime: data.prepTime || data.prep_time_min || 0,
    cookTime: data.cookTime || data.cook_time_min || 0,
    nutrition: data.nutrition || null,
    science_notes: data.science_notes || [],
    nutritionHighlight: data.nutritionHighlight || "",
    cookingTip: data.cookingTip || "",
    cuisine: data.cuisine || "",
    dietary: data.dietary || "",
    flavor_tags: data.flavor_tags || [],
    // Preserve any error message but explicitly set isError to false
    error_message: null,
    isError: false
  };
};

// Helper function to normalize ingredients array with various formats
function normalizeIngredients(ingredients: any): any[] {
  // If ingredients is not provided or not an array
  if (!ingredients) {
    return [{
      item: "Ingredient information unavailable",
      qty_metric: 0,
      unit_metric: "",
      qty_imperial: 0,
      unit_imperial: ""
    }];
  }
  
  // If ingredients is already an array
  if (Array.isArray(ingredients)) {
    // If array is empty, return default ingredient
    if (ingredients.length === 0) {
      return [{
        item: "Ingredient information unavailable",
        qty_metric: 0,
        unit_metric: "",
        qty_imperial: 0,
        unit_imperial: ""
      }];
    }
    
    // Process each ingredient to ensure consistent format
    return ingredients.map((ingredient: any) => {
      // If ingredient is a string (simple format)
      if (typeof ingredient === 'string') {
        return {
          item: ingredient,
          qty_metric: 0,
          unit_metric: "",
          qty_imperial: 0,
          unit_imperial: ""
        };
      }
      
      // If already in the correct format with metric/imperial units
      if (ingredient.qty_metric !== undefined || ingredient.qty_imperial !== undefined) {
        return ingredient;
      }
      
      // Handle case where item is nested inside an object property
      if (typeof ingredient.item === 'object' && ingredient.item !== null) {
        ingredient.item = ingredient.item.name || ingredient.item.item || "Unknown ingredient";
      }
      
      // Otherwise normalize to our expected format
      return {
        qty: ingredient.qty,
        unit: ingredient.unit,
        // Add metric units (same as original if not specified)
        qty_metric: ingredient.qty_metric || ingredient.qty,
        unit_metric: ingredient.unit_metric || ingredient.unit || "",
        // Add imperial units (same as original if not specified)
        qty_imperial: ingredient.qty_imperial || ingredient.qty,
        unit_imperial: ingredient.unit_imperial || ingredient.unit || "",
        item: ingredient.item,
        notes: ingredient.notes,
        shop_size_qty: ingredient.shop_size_qty,
        shop_size_unit: ingredient.shop_size_unit
      };
    });
  }
  
  // If ingredients is an object (single ingredient), convert to array
  if (typeof ingredients === 'object' && ingredients !== null) {
    return [{
      qty: ingredients.qty,
      unit: ingredients.unit,
      qty_metric: ingredients.qty_metric || ingredients.qty,
      unit_metric: ingredients.unit_metric || ingredients.unit || "",
      qty_imperial: ingredients.qty_imperial || ingredients.qty,
      unit_imperial: ingredients.unit_imperial || ingredients.unit || "",
      item: ingredients.item,
      notes: ingredients.notes,
      shop_size_qty: ingredients.shop_size_qty,
      shop_size_unit: ingredients.shop_size_unit
    }];
  }
  
  // Fallback for unexpected format
  return [{
    item: "Ingredient information unavailable",
    qty_metric: 0,
    unit_metric: "",
    qty_imperial: 0,
    unit_imperial: ""
  }];
}

// Helper function to create an error recipe
function createErrorRecipe(errorMessage: string, partialIngredients?: any[]): QuickRecipe {
  return {
    title: "Recipe Generation Issue",
    description: errorMessage,
    ingredients: partialIngredients || [{
      item: "Error generating ingredients",
      qty_metric: 0,
      unit_metric: "",
      qty_imperial: 0,
      unit_imperial: ""
    }],
    steps: ["There was an issue creating your recipe. Please try again."],
    instructions: ["There was an issue creating your recipe. Please try again."],
    servings: 2,
    isError: true,
    error_message: errorMessage,
    prep_time_min: 0,
    cook_time_min: 0,
    prepTime: 0,
    cookTime: 0,
    // Fix: Convert string to array
    science_notes: [],
    nutrition: null,
    nutritionHighlight: "",
    cookingTip: "",
    cuisine: "",
    dietary: "",
    flavor_tags: []
  };
}

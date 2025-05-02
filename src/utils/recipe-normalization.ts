import { Ingredient, QuickRecipe } from "@/types/quick-recipe";

// Function to normalize recipe response from edge function
export const normalizeRecipeResponse = (data: any): QuickRecipe => {
  console.log("Normalizing recipe response:", data);
  
  if (!data) {
    throw new Error("Invalid recipe data: Received empty response");
  }
  
  if (!data.title || !data.ingredients) {
    console.error("Invalid recipe data:", data);
    throw new Error("Invalid recipe data: Missing required fields");
  }
  
  // Handle different response formats
  const ingredients = data.ingredients?.map((ingredient: any) => {
    // If already in the correct format with metric/imperial units
    if (ingredient.qty_metric !== undefined || ingredient.qty_imperial !== undefined) {
      return ingredient;
    }
    
    // Otherwise normalize to our expected format
    return {
      qty: ingredient.qty,
      unit: ingredient.unit,
      // Add metric units (same as original if not specified)
      qty_metric: ingredient.qty,
      unit_metric: ingredient.unit,
      // Add imperial units (same as original if not specified)
      qty_imperial: ingredient.qty,
      unit_imperial: ingredient.unit,
      item: ingredient.item,
      notes: ingredient.notes,
      shop_size_qty: ingredient.shop_size_qty,
      shop_size_unit: ingredient.shop_size_unit
    };
  }) || [];
  
  // Normalize the recipe structure
  return {
    title: data.title,
    tagline: data.tagline || data.description,
    description: data.description,
    ingredients: ingredients,
    // Handle different property names for instructions/steps
    instructions: data.instructions || data.steps || [],
    steps: data.steps || data.instructions || [],
    servings: data.servings || 4,
    // Handle different property names for prep/cook time
    prep_time_min: data.prep_time_min || data.prepTime,
    cook_time_min: data.cook_time_min || data.cookTime,
    prepTime: data.prepTime || data.prep_time_min,
    cookTime: data.cookTime || data.cook_time_min,
    nutrition: data.nutrition,
    science_notes: data.science_notes || [],
    nutritionHighlight: data.nutritionHighlight,
    cookingTip: data.cookingTip,
    cuisine: data.cuisine,
    dietary: data.dietary,
    flavor_tags: data.flavor_tags || []
  };
};

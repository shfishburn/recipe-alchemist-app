
import { Ingredient, QuickRecipe } from "@/types/quick-recipe";

// Function to normalize recipe response from edge function
export const normalizeRecipeResponse = (data: any): QuickRecipe => {
  console.log("Normalizing recipe response:", data);
  
  // Handle completely empty data
  if (!data) {
    console.error("Empty recipe data received");
    return { 
      title: "Recipe Creation Error", 
      ingredients: [{
        item: "Missing ingredients",
        qty_metric: 0,
        unit_metric: "",
        qty_imperial: 0,
        unit_imperial: ""
      }],
      steps: ["Unable to create recipe with the provided information", "Please try again with different ingredients"],
      instructions: ["Unable to create recipe with the provided information", "Please try again with different ingredients"],
      servings: 2,
      isError: true,
      error_message: "Empty recipe data received"
    };
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
  
  // Log validation issues but don't throw errors
  if (!data.title || !data.ingredients) {
    console.warn("Recipe data missing required fields:", data);
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
  
  // Always ensure there's at least one ingredient if array is empty
  if (ingredients.length === 0) {
    ingredients.push({
      item: "Ingredient information unavailable",
      qty_metric: 0,
      unit_metric: "",
      qty_imperial: 0,
      unit_imperial: ""
    });
  }
  
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

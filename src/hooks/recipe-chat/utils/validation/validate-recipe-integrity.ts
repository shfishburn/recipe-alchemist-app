
import type { Recipe, Ingredient } from '@/types/recipe';

/**
 * Validates that a recipe object has all required properties with correct types
 * This helps ensure consistency between frontend and database types
 * @param recipe The recipe to validate
 * @throws Error if the recipe is invalid or missing required fields
 */
export function ensureRecipeIntegrity(recipe: any): void {
  // Check for required top-level fields
  if (!recipe) {
    throw new Error("Recipe cannot be null or undefined");
  }
  
  if (!recipe.id) {
    throw new Error("Recipe is missing required ID field");
  }
  
  if (!recipe.title) {
    throw new Error("Recipe is missing required title field");
  }
  
  // Validate ingredients array
  if (!Array.isArray(recipe.ingredients)) {
    throw new Error("Recipe ingredients must be an array");
  }
  
  if (recipe.ingredients.length === 0) {
    throw new Error("Recipe must have at least one ingredient");
  }
  
  // Validate instructions array
  if (!Array.isArray(recipe.instructions)) {
    throw new Error("Recipe instructions must be an array");
  }
  
  if (recipe.instructions.length === 0) {
    throw new Error("Recipe must have at least one instruction step");
  }
  
  // Validate that ingredients have required fields
  for (let i = 0; i < recipe.ingredients.length; i++) {
    const ingredient = recipe.ingredients[i];
    
    if (!ingredient) {
      throw new Error(`Ingredient at index ${i} is null or undefined`);
    }
    
    // Check for item field which is absolutely required
    if (!ingredient.item) {
      throw new Error(`Ingredient at index ${i} is missing required 'item' field`);
    }
    
    // Add fallbacks for common measurement fields
    recipe.ingredients[i] = {
      qty_metric: ingredient.qty_metric ?? 0,
      unit_metric: ingredient.unit_metric ?? '',
      qty_imperial: ingredient.qty_imperial ?? 0, 
      unit_imperial: ingredient.unit_imperial ?? '',
      ...ingredient
    };
  }
  
  // Ensure science_notes is an array
  if (!Array.isArray(recipe.science_notes)) {
    recipe.science_notes = [];
  }
  
  // Validate servings is a number
  if (typeof recipe.servings !== 'number' || isNaN(recipe.servings)) {
    recipe.servings = 1;
  }
  
  // Add basic defaults for missing fields to prevent database errors
  recipe.prep_time_min = recipe.prep_time_min || recipe.prepTime || 0;
  recipe.cook_time_min = recipe.cook_time_min || recipe.cookTime || 0;
  
  // Ensure updated_at is formatted as a string date
  if (!recipe.updated_at) {
    recipe.updated_at = new Date().toISOString();
  }
}


import type { Recipe } from '@/types/recipe';

/**
 * Ensures that the recipe has all required fields and proper data structure
 * This is a critical validation step before saving a complete recipe update
 */
export function ensureRecipeIntegrity(recipe: Recipe): void {
  // Check for required top-level fields
  if (!recipe.id) {
    throw new Error("Recipe ID is required");
  }
  
  if (!recipe.title || typeof recipe.title !== 'string' || recipe.title.trim() === '') {
    throw new Error("Recipe must have a valid title");
  }
  
  // Validate instructions
  if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
    throw new Error("Recipe must have at least one instruction");
  }
  
  // Validate ingredients
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    throw new Error("Recipe must have at least one ingredient");
  }
  
  // Check each ingredient has the required fields
  const invalidIngredients = recipe.ingredients.filter(ing => 
    !ing || 
    typeof ing !== 'object' || 
    typeof ing.qty_metric !== 'number' || 
    typeof ing.unit_metric !== 'string' || 
    typeof ing.qty_imperial !== 'number' || 
    typeof ing.unit_imperial !== 'string' || 
    typeof ing.item !== 'string' || 
    ing.item.trim() === ''
  );
  
  if (invalidIngredients.length > 0) {
    throw new Error(`Recipe has ${invalidIngredients.length} invalid ingredients`);
  }
  
  // Validate servings
  if (!recipe.servings || typeof recipe.servings !== 'number' || recipe.servings <= 0) {
    throw new Error("Recipe must have a valid servings count");
  }
  
  console.log("Recipe integrity validation passed");
}

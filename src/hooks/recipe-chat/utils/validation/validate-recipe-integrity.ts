
import type { Recipe } from '@/types/recipe';

/**
 * Ensures a recipe has all required fields and proper structure before saving
 * @param recipe Recipe object to validate
 * @throws Error if recipe is missing required fields or has structural issues
 */
export function ensureRecipeIntegrity(recipe: Recipe): void {
  // Check for required fields
  if (!recipe.id) {
    throw new Error("Recipe must have an ID");
  }

  if (!recipe.title) {
    throw new Error("Recipe must have a title");
  }

  // Validate ingredients
  if (!Array.isArray(recipe.ingredients)) {
    throw new Error("Recipe ingredients must be an array");
  }
  
  // Ensure each ingredient has required structure
  recipe.ingredients.forEach((ingredient, index) => {
    if (typeof ingredient !== 'object' || ingredient === null) {
      throw new Error(`Ingredient at position ${index} must be an object`);
    }

    // Handle item field which can be string or object with name
    if (ingredient.item === undefined) {
      throw new Error(`Ingredient at position ${index} must have an item property`);
    }

    // If item is an object, ensure it has a name property
    if (typeof ingredient.item === 'object') {
      if (!ingredient.item || !('name' in ingredient.item)) {
        throw new Error(`Ingredient object at position ${index} must have a name property`);
      }
    }
    
    // Ensure metric/imperial fields exist
    if (ingredient.qty_metric === undefined || 
        ingredient.unit_metric === undefined ||
        ingredient.qty_imperial === undefined ||
        ingredient.unit_imperial === undefined) {
      throw new Error(`Ingredient at position ${index} is missing required unit conversion properties`);
    }
  });

  // Validate instructions
  if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
    throw new Error("Recipe must have at least one instruction");
  }

  // Ensure each instruction is a string
  recipe.instructions.forEach((instruction, index) => {
    if (typeof instruction !== 'string') {
      throw new Error(`Instruction at position ${index} must be a string`);
    }
  });

  // Validate servings
  if (typeof recipe.servings !== 'number' || recipe.servings < 1) {
    throw new Error("Recipe must have a valid servings count (minimum 1)");
  }
}

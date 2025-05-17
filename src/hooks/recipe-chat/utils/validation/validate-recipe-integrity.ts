
import type { Recipe } from '@/types/recipe';

/**
 * Ensures that a recipe has all the required fields and data is in the correct format
 * @param recipe The recipe to validate
 * @throws Error if the recipe is invalid
 */
export function ensureRecipeIntegrity(recipe: Recipe): void {
  // Check for required fields
  if (!recipe.id) {
    throw new Error('Recipe must have an ID');
  }
  
  if (!recipe.title) {
    throw new Error('Recipe must have a title');
  }
  
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    throw new Error('Recipe must have at least one ingredient');
  }
  
  // Ensure every ingredient has the required fields
  recipe.ingredients.forEach((ingredient, index) => {
    if (!ingredient.item) {
      throw new Error(`Ingredient at index ${index} must have an item name`);
    }
    
    // Handle ingredient.item as either string or object with name
    if (typeof ingredient.item === 'object' && !ingredient.item.name) {
      throw new Error(`Ingredient at index ${index} must have a name property`);
    }
    
    // Ensure metric/imperial fields exist
    if (
      (ingredient.qty_metric === undefined || ingredient.unit_metric === undefined) &&
      (ingredient.qty_imperial === undefined || ingredient.unit_imperial === undefined) &&
      (ingredient.qty === undefined || ingredient.unit === undefined)
    ) {
      throw new Error(`Ingredient at index ${index} must have quantity and unit in some format`);
    }
  });
  
  // Ensure either steps or instructions is present (used interchangeably)
  if (
    (!Array.isArray(recipe.steps) || recipe.steps.length === 0) &&
    (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0)
  ) {
    throw new Error('Recipe must have at least one step or instruction');
  }
  
  // Ensure servings is a number
  if (typeof recipe.servings !== 'number' || recipe.servings <= 0) {
    throw new Error('Recipe must have a positive number of servings');
  }
  
  // Validate nutrition data if present
  if (recipe.nutrition) {
    if (typeof recipe.nutrition !== 'object') {
      throw new Error('Recipe nutrition must be an object');
    }
    
    // Basic nutrition fields check
    const requiredNutritionFields = ['calories', 'protein', 'carbs', 'fat'];
    for (const field of requiredNutritionFields) {
      if (typeof recipe.nutrition[field] !== 'number') {
        throw new Error(`Recipe nutrition must have a numeric ${field} value`);
      }
    }
  }
}

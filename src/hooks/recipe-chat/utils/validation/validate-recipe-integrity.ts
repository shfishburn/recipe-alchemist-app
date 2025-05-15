
import type { Recipe } from '@/types/recipe';

/**
 * Ensures that a recipe has all required fields before database operations
 * @param recipe The recipe to validate
 * @throws Error if the recipe is missing required fields
 */
export function ensureRecipeIntegrity(recipe: Partial<Recipe>): void {
  // Check for required fields
  if (!recipe.title) {
    throw new Error('Recipe is missing a title');
  }
  
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    throw new Error('Recipe must have at least one ingredient');
  }
  
  if (!recipe.instructions || !Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
    throw new Error('Recipe must have at least one instruction');
  }
  
  if (recipe.servings === undefined || recipe.servings <= 0) {
    // Set a reasonable default if missing
    recipe.servings = 4;
  }
  
  // Ensure ingredients have required fields
  recipe.ingredients = recipe.ingredients.map(ingredient => {
    // Handle potential issues with ingredient data
    if (typeof ingredient.item !== 'string' || !ingredient.item) {
      ingredient.item = 'Unnamed ingredient';
    }
    
    // Ensure required metric fields have default values if missing
    if (ingredient.qty_metric === undefined) {
      ingredient.qty_metric = ingredient.qty || 0;
    }
    
    if (!ingredient.unit_metric) {
      ingredient.unit_metric = ingredient.unit || '';
    }
    
    // Ensure required imperial fields have default values if missing
    if (ingredient.qty_imperial === undefined) {
      ingredient.qty_imperial = ingredient.qty_metric;
    }
    
    if (!ingredient.unit_imperial) {
      ingredient.unit_imperial = ingredient.unit_metric;
    }
    
    return ingredient;
  });
  
  // If science notes is not an array, convert it
  if (recipe.science_notes && !Array.isArray(recipe.science_notes)) {
    recipe.science_notes = [String(recipe.science_notes)];
  }
  
  // If flavor tags is not an array, convert it
  if (recipe.flavor_tags && !Array.isArray(recipe.flavor_tags)) {
    recipe.flavor_tags = [String(recipe.flavor_tags)];
  }
}

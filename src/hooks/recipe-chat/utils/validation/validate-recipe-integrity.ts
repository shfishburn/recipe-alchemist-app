
import type { Recipe } from '@/types/recipe';

/**
 * Ensures a recipe object has all required fields before database operations
 * @param recipe The recipe object to validate
 * @returns The validated recipe with all required fields
 */
export function ensureRecipeIntegrity(recipe: Partial<Recipe>): Recipe {
  if (!recipe) {
    throw new Error('Recipe object is null or undefined');
  }
  
  // Create copy to avoid mutating the original
  const validatedRecipe = { ...recipe };
  
  // Essential fields that must be present
  if (!validatedRecipe.title) {
    throw new Error('Recipe missing required field: title');
  }
  
  // Ensure ingredients is an array
  if (!validatedRecipe.ingredients || !Array.isArray(validatedRecipe.ingredients)) {
    validatedRecipe.ingredients = [];
  }
  
  // Ensure instructions is an array
  if (!validatedRecipe.instructions || !Array.isArray(validatedRecipe.instructions)) {
    validatedRecipe.instructions = [];
  }
  
  // Ensure servings is defined (critical for database validation)
  if (validatedRecipe.servings === undefined || validatedRecipe.servings === null) {
    validatedRecipe.servings = 1; // Default to 1 serving
  }
  
  // Ensure science_notes is an array
  if (!validatedRecipe.science_notes || !Array.isArray(validatedRecipe.science_notes)) {
    validatedRecipe.science_notes = [];
  }
  
  // Ensure nutrition object exists
  if (!validatedRecipe.nutrition) {
    validatedRecipe.nutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };
  }
  
  return validatedRecipe as Recipe;
}

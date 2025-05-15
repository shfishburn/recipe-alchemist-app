
import type { Recipe } from '@/types/recipe';

/**
 * Helper functions to transform recipe data for different contexts
 */

/**
 * Gets the description for a recipe, handling both tagline and description fields
 */
export function getRecipeDescription(recipe: Recipe): string {
  return recipe.tagline || '';
}

/**
 * Ensures a recipe has all required fields with safe defaults
 */
export function ensureCompleteRecipe(recipe: Partial<Recipe>): Recipe {
  return {
    id: recipe.id || '',
    title: recipe.title || 'Untitled Recipe',
    tagline: recipe.tagline || '',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    science_notes: recipe.science_notes || [],
    ...recipe
  };
}

/**
 * Check if a recipe has essential data
 */
export function isRecipeComplete(recipe?: Partial<Recipe>): boolean {
  if (!recipe) return false;
  
  return !!(
    recipe.id &&
    recipe.title &&
    recipe.ingredients?.length > 0 &&
    recipe.instructions?.length > 0
  );
}

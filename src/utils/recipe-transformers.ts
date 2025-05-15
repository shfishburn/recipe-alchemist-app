
import type { Recipe } from '@/types/recipe';

/**
 * Gets a description for a recipe, using tagline if available or
 * a fallback message if not.
 */
export function getRecipeDescription(recipe: Recipe): string {
  return recipe.tagline || 
         "A delicious recipe waiting to be explored. Check it out for ingredients and instructions.";
}

/**
 * Ensures a recipe has all required fields by providing defaults
 * for missing values.
 */
export function ensureRecipeCompleteness(recipe: Partial<Recipe>): Recipe {
  return {
    id: recipe.id || '',
    title: recipe.title || 'Untitled Recipe',
    tagline: recipe.tagline || '',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    science_notes: recipe.science_notes || [],
    nutrition: recipe.nutrition || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    ...(recipe as any)
  };
}

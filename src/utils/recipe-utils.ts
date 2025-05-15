
import type { Recipe } from '@/types/recipe';

/**
 * Format cooking time from minutes to hours and minutes
 * @param minutes Total time in minutes
 * @returns Formatted time string
 */
export function formatCookingTime(minutes?: number): string {
  if (!minutes) return 'N/A';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}, ${remainingMinutes} min`;
}

/**
 * Get the description from either the tagline or description field
 */
export function getRecipeDescription(recipe: Recipe): string {
  // Prefer tagline (current schema) but fall back to description if present
  return recipe.tagline || '';
}

/**
 * Transform recipe data for UI presentation
 */
export function transformRecipeData(recipe: Recipe): Recipe {
  // Ensure consistent data shape for UI components
  return {
    ...recipe,
    // Ensure ingredients is always an array
    ingredients: recipe.ingredients || [],
    // Ensure instructions is always an array
    instructions: recipe.instructions || [],
    // Ensure science_notes is always an array
    science_notes: recipe.science_notes || [],
  };
}

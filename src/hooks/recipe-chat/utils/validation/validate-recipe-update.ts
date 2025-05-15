
import { Recipe } from '@/types/recipe';
import { ChangesResponse } from '@/types/chat';

/**
 * Validate that a recipe update is valid before applying it
 */
export function validateRecipeUpdate(
  recipe: Recipe,
  changes?: ChangesResponse | null
): boolean {
  if (!recipe) {
    console.error("Missing recipe in validateRecipeUpdate");
    return false;
  }
  
  if (!recipe.id) {
    console.error("Recipe is missing ID in validateRecipeUpdate");
    return false;
  }
  
  // If no changes, consider it valid (nothing to update)
  if (!changes) {
    return true;
  }
  
  // Check if ingredients structure is valid when it exists
  if (changes.ingredients) {
    if (!changes.ingredients.mode) {
      console.error("Missing ingredients.mode in changes");
      return false;
    }
    
    if (changes.ingredients.mode !== 'none' && 
       (!Array.isArray(changes.ingredients.items) || 
        changes.ingredients.items.length === 0)) {
      console.warn("Ingredients mode is not 'none' but items array is empty");
      // This might be acceptable, but worth logging a warning
    }
  }
  
  // Check for instructions array when present
  if (changes.instructions && !Array.isArray(changes.instructions)) {
    console.error("Instructions must be an array");
    return false;
  }
  
  return true;
}

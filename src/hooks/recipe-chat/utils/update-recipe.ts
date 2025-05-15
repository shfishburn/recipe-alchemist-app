import type { Recipe, Ingredient } from '@/types/recipe';
import type { ChangesResponse, IngredientChange } from '@/types/chat';
import { validateRecipeUpdate } from './validation/validate-recipe-update';

/**
 * Apply changes to a recipe and return the updated recipe
 */
export function updateRecipe(recipe: Recipe, changes: ChangesResponse): Recipe {
  // Validate the changes before applying them
  if (!validateRecipeUpdate(recipe, changes)) {
    console.error("Invalid recipe update");
    return recipe; // Return original recipe if validation fails
  }

  // Create a deep copy to avoid mutating the original
  const updatedRecipe = JSON.parse(JSON.stringify(recipe)) as Recipe;
  
  // Apply title changes if a new title is provided
  if (changes.title && changes.title !== recipe.title) {
    updatedRecipe.title = changes.title;
  }
  
  // Apply ingredient changes based on mode
  if (changes.ingredients && changes.ingredients.mode !== 'none') {
    const { mode, items } = changes.ingredients;
    
    if (mode === 'replace' && Array.isArray(items) && items.length > 0) {
      // Convert items from the AI format to the Ingredient format
      updatedRecipe.ingredients = items.map((item: IngredientChange): Ingredient => ({
        qty_imperial: item.qty || 0,
        unit_imperial: item.unit || '',
        qty_metric: item.qty || 0, // Should properly convert
        unit_metric: '', // Should properly convert based on unit_imperial
        item: item.item || '',
        notes: item.notes
      }));
    } 
    else if (mode === 'add' && Array.isArray(items) && items.length > 0) {
      // Keep existing ingredients and add new ones
      const convertedItems: Ingredient[] = items.map((item: IngredientChange): Ingredient => ({
        qty_imperial: item.qty || 0,
        unit_imperial: item.unit || '',
        qty_metric: item.qty || 0, // Should properly convert
        unit_metric: '', // Should properly convert based on unit_imperial
        item: item.item || '',
        notes: item.notes
      }));
      
      updatedRecipe.ingredients = [...(updatedRecipe.ingredients || []), ...convertedItems];
    }
  }
  
  // Apply instruction/steps changes
  if (Array.isArray(changes.instructions) && changes.instructions.length > 0) {
    // Handle whether recipe uses 'steps' or 'instructions' field
    if (Array.isArray(updatedRecipe.steps)) {
      updatedRecipe.steps = changes.instructions.map(item => 
        typeof item === 'string' ? item : item.text
      );
    } else if (Array.isArray(updatedRecipe.instructions)) {
      updatedRecipe.instructions = changes.instructions.map(item => 
        typeof item === 'string' ? item : item.text
      );
    }
  }
  
  return updatedRecipe;
}

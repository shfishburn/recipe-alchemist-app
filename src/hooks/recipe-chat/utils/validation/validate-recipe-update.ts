
import type { Recipe } from '@/types/recipe';
import type { ChangesResponse } from '@/types/chat';

export function validateRecipeUpdate(recipe: Recipe, changes: ChangesResponse | null | undefined) {
  if (!changes) {
    console.log("No changes to validate");
    return false;
  }

  if (!recipe?.id) {
    console.error("Invalid recipe provided for validation");
    return false;
  }

  // Basic validation - can be extended with more specific rules
  try {
    // Validate title changes
    if (changes.title !== undefined && typeof changes.title !== 'string') {
      console.error("Invalid title format");
      return false;
    }
    
    // Validate ingredients changes
    if (changes.ingredients) {
      const { mode, items } = changes.ingredients;
      
      if (mode !== 'add' && mode !== 'replace' && mode !== 'none') {
        console.error("Invalid ingredients mode:", mode);
        return false;
      }
      
      if (mode !== 'none' && (!Array.isArray(items) || items.length === 0)) {
        console.error("Missing or empty ingredients items array");
        return false;
      }
    }
    
    // Validate instructions changes
    if (changes.instructions && !Array.isArray(changes.instructions)) {
      console.error("Instructions must be an array");
      return false;
    }
    
    // Validate science_notes changes
    if (changes.science_notes && !Array.isArray(changes.science_notes)) {
      console.error("Science notes must be an array");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}


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
      
      // Validate each ingredient item structure
      if (mode !== 'none' && Array.isArray(items)) {
        for (const item of items) {
          if (typeof item === 'string') {
            continue; // String ingredients are valid
          }
          
          // Basic structure validation for object ingredients
          if (!item || typeof item !== 'object') {
            console.error("Invalid ingredient item format");
            return false;
          }
        }
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
    
    // Validate nutrition data if present
    if (changes.nutrition) {
      // Ensure it's an object
      if (typeof changes.nutrition !== 'object' || changes.nutrition === null) {
        console.error("Nutrition must be a valid object");
        return false;
      }
      
      // Check for minimum required nutrition fields
      const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
      
      // Log for debugging
      console.log("Validating nutrition data:", changes.nutrition);
      
      // We don't strictly enforce these fields, just log warnings
      for (const field of requiredFields) {
        if (!(field in changes.nutrition) || changes.nutrition[field] === undefined) {
          console.warn(`Missing nutrition field: ${field}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}

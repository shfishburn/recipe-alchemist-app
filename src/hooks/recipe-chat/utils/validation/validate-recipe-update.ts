
import type { Recipe } from '@/types/recipe';
import type { ChangesResponse } from '@/types/chat';

/**
 * Validates recipe updates before applying them
 * @param recipe - The current recipe
 * @param changes - The changes to be applied
 * @returns boolean indicating if the changes are valid
 */
export function validateRecipeUpdate(
  recipe: Recipe,
  changes?: ChangesResponse | null
): boolean {
  // If there are no changes, it's automatically valid
  if (!changes) {
    return true;
  }
  
  console.log("Validating recipe update for recipe ID:", recipe.id);
  console.log("Changes object:", JSON.stringify(changes, null, 2));
  
  // If title is being updated, validate it
  if (changes.title !== undefined) {
    console.log("Title before validation:", changes.title, "Type:", typeof changes.title);
    
    // Handle explicit null values by ignoring them
    if (changes.title === null) {
      console.warn("Ignoring null title value in changes");
      return true; // Continue with other validations
    }
    
    // Validate title type and content
    if (typeof changes.title !== 'string') {
      console.error("Invalid title type:", typeof changes.title);
      return false;
    }
    
    if (changes.title.trim() === '') {
      console.error("Title cannot be empty");
      return false;
    }
  }
  
  // If ingredients are being updated, validate them
  if (changes.ingredients && changes.ingredients.mode !== 'none') {
    const { items = [] } = changes.ingredients;
    
    // Ensure items is an array and not empty for replace mode
    if (changes.ingredients.mode === 'replace' && (!Array.isArray(items) || items.length === 0)) {
      console.error("Cannot replace ingredients with empty array");
      return false;
    }
    
    // Validate each ingredient if provided
    if (Array.isArray(items)) {
      for (const ingredient of items) {
        if (!ingredient.item || ingredient.item.trim() === '') {
          console.error("Ingredient missing item name");
          return false;
        }
        if (ingredient.qty === undefined || isNaN(Number(ingredient.qty))) {
          console.error("Ingredient has invalid quantity:", ingredient.qty);
          return false;
        }
      }
    }
  }
  
  // If instructions are being updated, validate them
  if (changes.instructions && Array.isArray(changes.instructions)) {
    // For now, just verify none are empty
    for (const instruction of changes.instructions) {
      if (!instruction || instruction.trim() === '') {
        console.error("Empty instructions are not allowed");
        return false;
      }
    }
  }
  
  // All validations passed
  return true;
}

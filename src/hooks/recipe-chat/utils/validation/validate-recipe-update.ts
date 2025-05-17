import type { Recipe } from '@/types/recipe';
import type { SuggestedChanges } from '@/types/chat';

/**
 * Validates that the suggested changes can be properly applied to the recipe
 * @param recipe The original recipe
 * @param changes The suggested changes to apply
 * @returns True if changes are valid, false otherwise
 */
export function validateRecipeUpdate(
  recipe: Recipe,
  changes: SuggestedChanges | undefined
): boolean {
  // No changes means nothing to validate
  if (!changes) {
    return false;
  }

  // Basic validation of the recipe object
  if (!recipe || !recipe.id) {
    console.error("Invalid recipe provided for update");
    return false;
  }

  try {
    // If title change, validate it's a proper string
    if (changes.title !== undefined && (typeof changes.title !== 'string' || changes.title.trim() === '')) {
      console.error("Invalid title provided in changes");
      return false;
    }

    // Validate ingredient changes
    if (changes.ingredients) {
      const { mode, items } = changes.ingredients;
      
      // Validate mode
      if (!['add', 'replace', 'none'].includes(mode)) {
        console.error("Invalid ingredient change mode:", mode);
        return false;
      }
      
      // If there are items, validate they have the proper structure
      if (items && Array.isArray(items)) {
        const validIngredients = items.every(item => 
          item && 
          typeof item === 'object' &&
          (typeof item.item === 'string' || 
           (typeof item.item === 'object' && item.item !== null && 'name' in item.item))
        );
        
        if (!validIngredients) {
          console.error("Invalid ingredient structure in changes");
          return false;
        }
      }
    }

    // Validate instruction changes
    if (changes.instructions) {
      // If instructions is an array of strings, validate those
      if (changes.instructions.every(instr => typeof instr === 'string')) {
        // Valid array of strings - nothing to do
      } 
      // If it's an array of objects, validate they have the proper structure
      else if (changes.instructions.every(instr => 
        typeof instr === 'object' && instr !== null && 'action' in instr
      )) {
        // Valid array of instruction change objects - nothing to do
      } 
      // Otherwise, it's invalid
      else {
        console.error("Invalid instruction structure in changes");
        return false;
      }
    }

    // Validate science notes
    if (changes.science_notes && Array.isArray(changes.science_notes)) {
      const validNotes = changes.science_notes.every(note => 
        typeof note === 'string' && note.trim() !== ''
      );
      
      if (!validNotes) {
        console.error("Invalid science notes in changes");
        return false;
      }
    }

    // If we get here, everything is valid
    return true;
  } catch (error) {
    console.error("Error validating recipe update:", error);
    return false;
  }
}

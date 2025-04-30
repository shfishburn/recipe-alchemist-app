
import type { ChangesResponse } from '@/types/chat';

/**
 * Extract a summary of the changes with improved null safety
 */
export function extractChangesSummary(changesSuggested: ChangesResponse | null) {
  if (!changesSuggested) return null;
  
  const summary = {
    hasTitle: !!changesSuggested.title,
    hasIngredients: changesSuggested.ingredients?.items && 
                  Array.isArray(changesSuggested.ingredients.items) && 
                  changesSuggested.ingredients.items.length > 0 &&
                  changesSuggested.ingredients.mode !== 'none',
    hasInstructions: changesSuggested.instructions && 
                   Array.isArray(changesSuggested.instructions) && 
                   changesSuggested.instructions.length > 0,
    hasScienceNotes: changesSuggested.science_notes && 
                   Array.isArray(changesSuggested.science_notes) && 
                   changesSuggested.science_notes.length > 0,
    ingredientCount: (changesSuggested.ingredients?.items?.length || 0),
    instructionCount: (changesSuggested.instructions?.length || 0),
    scienceNoteCount: (changesSuggested.science_notes?.length || 0),
    ingredientMode: changesSuggested.ingredients?.mode || 'none'
  };
  
  return summary;
}

/**
 * Checks if recipe has ingredient warnings
 */
export function checkIngredientWarnings(changesSuggested: ChangesResponse | null): boolean {
  if (!changesSuggested?.ingredients?.items || 
      !Array.isArray(changesSuggested.ingredients.items)) {
    return false;
  }
  
  // Check for any ingredients with warning notes
  return changesSuggested.ingredients.items.some((item: any) => 
    item?.notes?.toLowerCase?.().includes('warning')
  );
}

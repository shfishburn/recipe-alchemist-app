
import type { ChangesResponse, SuggestedChanges } from '@/types/chat';

/**
 * Extract a summary of the changes with improved null safety
 */
export function extractChangesSummary(changesSuggested: SuggestedChanges | ChangesResponse | null) {
  if (!changesSuggested) return null;
  
  // Convert any ChangesResponse to SuggestedChanges
  const changes = changesSuggested as SuggestedChanges;
  
  const summary = {
    hasTitle: !!changes.title,
    hasIngredients: changes.ingredients?.items && 
                  Array.isArray(changes.ingredients.items) && 
                  changes.ingredients.items.length > 0 &&
                  changes.ingredients.mode !== 'none',
    hasInstructions: changes.instructions && 
                   Array.isArray(changes.instructions) && 
                   changes.instructions.length > 0,
    hasScienceNotes: changes.science_notes && 
                   Array.isArray(changes.science_notes) && 
                   changes.science_notes.length > 0,
    ingredientCount: (changes.ingredients?.items?.length || 0),
    instructionCount: (changes.instructions?.length || 0),
    scienceNoteCount: (changes.science_notes?.length || 0),
    ingredientMode: changes.ingredients?.mode || 'none'
  };
  
  return summary;
}

/**
 * Checks if recipe has ingredient warnings
 */
export function checkIngredientWarnings(changesSuggested: SuggestedChanges | ChangesResponse | null): boolean {
  if (!changesSuggested) return false;
  
  // Convert any ChangesResponse to SuggestedChanges
  const changes = changesSuggested as SuggestedChanges;
  
  if (!changes.ingredients?.items || 
      !Array.isArray(changes.ingredients.items)) {
    return false;
  }
  
  // Check for any ingredients with warning notes
  return changes.ingredients.items.some((item: any) => 
    item?.notes?.toLowerCase?.().includes('warning')
  );
}

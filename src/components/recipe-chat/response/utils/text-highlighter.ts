
import { SuggestedChanges } from "@/types/chat";

export function highlightText(text: string, changes: SuggestedChanges): string {
  // Initialize the result with the original text
  let result = text;

  try {
    // If there are ingredient changes, highlight them
    if (changes.ingredients && changes.ingredients.items && changes.ingredients.items.length > 0) {
      // For ingredient highlighting logic
      // This is simplified, but you could add specific highlighting for ingredients
    }

    // If there are instruction changes, highlight them
    if (changes.instructions && Array.isArray(changes.instructions)) {
      changes.instructions.forEach((instruction) => {
        if (typeof instruction === 'string') {
          // Just a string instruction, no specific highlighting
          return;
        }
        
        // Handle instruction change objects
        if (instruction.action) {
          const regex = new RegExp(`(${instruction.text?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          result = result.replace(regex, '<mark class="highlight-change">$1</mark>');
        }
      });
    }

    // If title is changed, highlight it
    if (changes.title) {
      const titleRegex = new RegExp(`(${changes.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(titleRegex, '<mark class="highlight-title-change">$1</mark>');
    }
  } catch (error) {
    console.error('Error applying text highlights:', error);
  }

  return result;
}

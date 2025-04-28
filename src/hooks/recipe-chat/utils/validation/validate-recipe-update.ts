
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export function validateRecipeUpdate(recipe: Recipe, chatMessage: ChatMessage) {
  if (!chatMessage.changes_suggested) {
    throw new Error("No changes to apply");
  }

  if (!recipe?.id) {
    throw new Error("Invalid recipe data");
  }

  // Validate science notes if they exist
  if (chatMessage.changes_suggested.science_notes) {
    if (!Array.isArray(chatMessage.changes_suggested.science_notes)) {
      throw new Error("Invalid science notes format");
    }
  }

  return true;
}

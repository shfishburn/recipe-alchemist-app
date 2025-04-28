
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export function validateRecipeUpdate(recipe: Recipe, chatMessage: ChatMessage) {
  if (!chatMessage.changes_suggested) {
    throw new Error("No changes to apply");
  }

  if (!recipe?.id) {
    throw new Error("Invalid recipe data");
  }

  // Add any additional validation logic here if needed
  return true;
}

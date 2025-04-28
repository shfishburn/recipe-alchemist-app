
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export function processRecipeUpdates(recipe: Recipe, chatMessage: ChatMessage): Partial<Recipe> & { id: string } {
  const updatedRecipe: Partial<Recipe> & { id: string } = {
    ...recipe,
    title: chatMessage.changes_suggested?.title || recipe.title,
    nutrition: chatMessage.changes_suggested?.nutrition || recipe.nutrition,
    image_url: recipe.image_url,
    science_notes: chatMessage.changes_suggested?.science_notes || recipe.science_notes || [],
    updated_at: new Date().toISOString()
  };

  // Process instructions if they exist
  if (chatMessage.changes_suggested?.instructions && 
      Array.isArray(chatMessage.changes_suggested.instructions)) {
    console.log("Updating instructions");
    
    // Make sure all instructions are properly formatted
    const formattedInstructions = chatMessage.changes_suggested.instructions.map(
      instruction => {
        if (typeof instruction === 'string') {
          return instruction;
        }
        if (typeof instruction === 'object' && instruction.action) {
          return instruction.action;
        }
        console.warn("Skipping invalid instruction format:", instruction);
        return null;
      }
    ).filter(Boolean);
    
    if (formattedInstructions.length > 0) {
      updatedRecipe.instructions = formattedInstructions as string[];
    } else {
      console.warn("No valid instructions found in changes");
    }
  }

  return updatedRecipe;
}

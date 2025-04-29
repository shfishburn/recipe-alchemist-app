import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export function processRecipeUpdates(recipe: Recipe, chatMessage: ChatMessage): Partial<Recipe> & { id: string } {
  console.log("Processing recipe updates with changes:", {
    hasTitle: !!chatMessage.changes_suggested?.title,
    hasIngredients: !!chatMessage.changes_suggested?.ingredients?.items?.length,
    ingredientMode: chatMessage.changes_suggested?.ingredients?.mode,
    hasInstructions: !!chatMessage.changes_suggested?.instructions?.length,
    hasNutrition: !!chatMessage.changes_suggested?.nutrition,
    hasScienceNotes: !!chatMessage.changes_suggested?.science_notes?.length
  });

  const updatedRecipe: Partial<Recipe> & { id: string } = {
    id: recipe.id,
    updated_at: new Date().toISOString()
  };

  // Only update title if a new one is provided
  if (chatMessage.changes_suggested?.title) {
    updatedRecipe.title = chatMessage.changes_suggested.title;
  }

  // Only update nutrition if new data is provided
  if (chatMessage.changes_suggested?.nutrition) {
    updatedRecipe.nutrition = chatMessage.changes_suggested.nutrition;
  }

  // Safely update science notes - never replace with an empty array
  if (chatMessage.changes_suggested?.science_notes && 
      Array.isArray(chatMessage.changes_suggested.science_notes) &&
      chatMessage.changes_suggested.science_notes.length > 0) {
    console.log("Updating science notes with", chatMessage.changes_suggested.science_notes.length, "items");
    updatedRecipe.science_notes = chatMessage.changes_suggested.science_notes;
  } else if (recipe.science_notes && recipe.science_notes.length > 0) {
    // Keep existing science notes if they exist
    updatedRecipe.science_notes = recipe.science_notes;
  }

  // Safely update instructions - never replace with an empty array
  if (chatMessage.changes_suggested?.instructions && 
      Array.isArray(chatMessage.changes_suggested.instructions) &&
      chatMessage.changes_suggested.instructions.length > 0) {
    console.log("Updating instructions with", chatMessage.changes_suggested.instructions.length, "items");
    
    // Process instructions to ensure they're all strings
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
    
    // Only update if we have valid instructions after processing
    if (formattedInstructions.length > 0) {
      updatedRecipe.instructions = formattedInstructions as string[];
    } else {
      // Keep existing instructions
      updatedRecipe.instructions = recipe.instructions;
    }
  } else {
    // Keep existing instructions
    updatedRecipe.instructions = recipe.instructions;
  }

  // Keep existing image URL
  updatedRecipe.image_url = recipe.image_url;

  return updatedRecipe;
}

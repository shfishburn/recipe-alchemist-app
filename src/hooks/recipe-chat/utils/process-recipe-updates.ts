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

  // Start with a complete copy of the original recipe to prevent data loss
  const updatedRecipe: Recipe = {
    ...recipe,
    updated_at: new Date().toISOString()
  };

  // Only override specific fields if they're provided in the changes
  if (chatMessage.changes_suggested?.title) {
    updatedRecipe.title = chatMessage.changes_suggested.title;
  }

  if (chatMessage.changes_suggested?.nutrition) {
    updatedRecipe.nutrition = chatMessage.changes_suggested.nutrition;
  }

  // Safely update science notes - never replace with an empty array
  if (chatMessage.changes_suggested?.science_notes && 
      Array.isArray(chatMessage.changes_suggested.science_notes) &&
      chatMessage.changes_suggested.science_notes.length > 0) {
    console.log("Updating science notes with", chatMessage.changes_suggested.science_notes.length, "items");
    updatedRecipe.science_notes = chatMessage.changes_suggested.science_notes;
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
    }
  }

  // Process ingredients if they exist using the provided mode
  if (chatMessage.changes_suggested?.ingredients?.items) {
    const { mode = 'none', items = [] } = chatMessage.changes_suggested.ingredients;
    console.log("Processing ingredients:", { mode, itemCount: items.length });
    
    if (mode !== 'none' && items.length > 0) {
      // Update ingredients based on mode
      if (mode === 'add') {
        console.log("Adding new ingredients to existing recipe");
        updatedRecipe.ingredients = [...recipe.ingredients, ...items];
      } else if (mode === 'replace') {
        console.log("Replacing all ingredients");
        updatedRecipe.ingredients = items;
      }
      // For 'none' mode, keep existing ingredients
    }
  }

  // Data validation to ensure critical fields are always present
  if (!updatedRecipe.ingredients || !Array.isArray(updatedRecipe.ingredients) || updatedRecipe.ingredients.length === 0) {
    console.warn("No ingredients found in updated recipe, keeping original ingredients");
    updatedRecipe.ingredients = recipe.ingredients;
  }
  
  if (!updatedRecipe.instructions || !Array.isArray(updatedRecipe.instructions) || updatedRecipe.instructions.length === 0) {
    console.warn("No instructions found in updated recipe, keeping original instructions");
    updatedRecipe.instructions = recipe.instructions;
  }

  // Keep the image URL intact
  updatedRecipe.image_url = recipe.image_url;

  console.log("Final updated recipe status:", {
    hasIngredients: updatedRecipe.ingredients.length > 0,
    hasInstructions: updatedRecipe.instructions.length > 0,
    hasScienceNotes: updatedRecipe.science_notes && updatedRecipe.science_notes.length > 0,
  });

  return updatedRecipe;
}

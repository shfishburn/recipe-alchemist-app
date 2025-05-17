import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';

export function processRecipeUpdates(recipe: Recipe, chatMessage: ChatMessage): Partial<Recipe> & { id: string } {
  console.log("Processing recipe updates with changes:", {
    hasTitle: !!chatMessage.changes_suggested?.title,
    hasIngredients: !!chatMessage.changes_suggested?.ingredients?.items?.length,
    ingredientMode: chatMessage.changes_suggested?.ingredients?.mode,
    hasInstructions: !!chatMessage.changes_suggested?.instructions?.length,
    hasNutrition: !!chatMessage.changes_suggested?.nutrition,
    hasScienceNotes: !!chatMessage.changes_suggested?.science_notes?.length,
    // Check for complete recipe object coming from the updated API
    hasCompleteRecipe: !!(chatMessage as any).recipe 
  });

  // Start with a complete copy of the original recipe to prevent data loss
  let updatedRecipe: Recipe = {
    ...recipe,
    updated_at: new Date().toISOString()
  };

  // If we have a complete recipe object in the chat message, use it
  // Note: We're using type assertion since the ChatMessage type might not be updated yet
  if ((chatMessage as any).recipe) {
    console.log("Using complete recipe object from chat message");
    updatedRecipe = {
      ...updatedRecipe,
      ...(chatMessage as any).recipe,
      id: recipe.id, // Always preserve the original recipe ID
      updated_at: new Date().toISOString() // Update the timestamp
    };
    
    // If version info is present, add it to the recipe
    if ((chatMessage as any).recipe.version_info) {
      updatedRecipe.version_info = (chatMessage as any).recipe.version_info;
    }
    
    // Return the updated recipe
    return updatedRecipe;
  }

  // Fall back to processing individual changes if no complete recipe is provided
  
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

  // Process instructions if they exist and are not just placeholders
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
    
    // Validate that instructions are not just placeholders
    const hasValidInstructions = formattedInstructions.some(instr => {
      const instrText = String(instr).toLowerCase();
      return instrText.length > 20 && 
             !instrText.includes("add steps") &&
             !instrText.includes("cooking steps");
    });
    
    if (hasValidInstructions) {
      console.log("Valid instruction updates found");
      updatedRecipe.instructions = formattedInstructions as string[];
    } else {
      console.warn("Only placeholder instructions detected - keeping original instructions");
      // Keep original instructions
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

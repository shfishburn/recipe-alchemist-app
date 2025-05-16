
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { saveRecipeUpdate } from './db/save-recipe-update';
import { ensureRecipeIntegrity } from './validation/validate-recipe-integrity';

/**
 * Unified recipe update function that works with complete recipe objects
 * Rather than merging partial changes
 */
export async function updateRecipeUnified(
  originalRecipe: Recipe,
  chatMessage: ChatMessage
): Promise<Recipe> {
  console.log("Starting unified recipe update with complete recipe object");
  
  // Extract the complete recipe from the chat message
  if (!chatMessage.recipe) {
    console.error("No complete recipe found in chat message");
    throw new Error("This message doesn't contain a complete recipe update");
  }
  
  try {
    // Create a new recipe object that merges the original recipe's ID with the updated data
    const updatedRecipe: Recipe = {
      ...chatMessage.recipe as unknown as Recipe, // Explicit cast to Recipe
      id: originalRecipe.id, // Always preserve original ID
      updated_at: new Date().toISOString()
    };
    
    // Log the key information about the updated recipe
    console.log("Unified recipe update data:", {
      id: updatedRecipe.id,
      title: updatedRecipe.title,
      hasIngredients: Array.isArray(updatedRecipe.ingredients) && updatedRecipe.ingredients.length > 0,
      ingredientCount: Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients.length : 0,
      hasInstructions: Array.isArray(updatedRecipe.instructions) && updatedRecipe.instructions.length > 0,
      instructionCount: Array.isArray(updatedRecipe.instructions) ? updatedRecipe.instructions.length : 0,
      hasNotes: Array.isArray(updatedRecipe.science_notes) && updatedRecipe.science_notes.length > 0,
      noteCount: updatedRecipe.science_notes?.length || 0
    });
    
    // Verify recipe integrity before saving
    ensureRecipeIntegrity(updatedRecipe);
    
    // Save the recipe update and get the response
    const savedResponse = await saveRecipeUpdate(updatedRecipe);
    
    if (!savedResponse) {
      throw new Error("Failed to save recipe update");
    }
    
    // Return the properly formatted Recipe
    return {
      ...updatedRecipe,
      // Only update fields that might have changed during saving
      updated_at: savedResponse.updated_at || updatedRecipe.updated_at
    };
  } catch (error) {
    console.error("Unified recipe update error:", error);
    throw error;
  }
}

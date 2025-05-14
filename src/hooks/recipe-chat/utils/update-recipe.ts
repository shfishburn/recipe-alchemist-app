
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { findDuplicateIngredients, validateIngredientQuantities } from './ingredients/ingredient-validation';
import { processRecipeUpdates } from './process-recipe-updates';
import { saveRecipeUpdate } from './db/save-recipe-update';
import { validateRecipeUpdate } from './validation/validate-recipe-update';
import { ensureRecipeIntegrity } from './validation/validate-recipe-integrity';

export async function updateRecipe(
  recipe: Recipe,
  chatMessage: ChatMessage
) {
  // Critical: Ensure recipe_id consistency
  if (!recipe?.id) {
    throw new Error("Invalid recipe: Missing ID");
  }
  
  // Ensure chat message has recipe_id reference
  if (!chatMessage.recipe_id) {
    console.warn("Chat message missing recipe_id, setting it to recipe.id");
    chatMessage.recipe_id = recipe.id;
  }
  
  // Verify recipe_id matches
  if (chatMessage.recipe_id && chatMessage.recipe_id !== recipe.id) {
    console.warn("Chat message recipe_id doesn't match recipe.id, correcting");
    chatMessage.recipe_id = recipe.id;
  }
  
  // Initial validation of inputs
  if (!validateRecipeUpdate(recipe, chatMessage.changes_suggested)) {
    throw new Error("Failed to validate recipe update");
  }
  
  console.log("Starting recipe update with changes:", {
    hasTitle: !!chatMessage.changes_suggested?.title,
    hasIngredients: !!chatMessage.changes_suggested?.ingredients,
    ingredientMode: chatMessage.changes_suggested?.ingredients?.mode,
    ingredientCount: chatMessage.changes_suggested?.ingredients?.items?.length,
    hasInstructions: !!chatMessage.changes_suggested?.instructions,
    hasNutrition: !!chatMessage.changes_suggested?.nutrition,
    hasScienceNotes: !!chatMessage.changes_suggested?.science_notes,
    scienceNoteCount: chatMessage.changes_suggested?.science_notes?.length
  });

  try {
    // Process basic recipe updates - this now returns a complete recipe copy with changes applied
    const updatedRecipe = processRecipeUpdates(recipe, chatMessage);

    // Verify recipe integrity before saving
    ensureRecipeIntegrity(updatedRecipe);
    
    // Advanced ingredient validations if ingredients are being modified
    if (chatMessage.changes_suggested?.ingredients?.items) {
      const { mode = 'none', items = [] } = chatMessage.changes_suggested.ingredients;
      
      if (mode !== 'none' && items.length > 0) {
        // Validate ingredient format
        const validIngredients = items.every(item => 
          typeof item.qty === 'number' && 
          typeof item.unit === 'string' && 
          typeof item.item === 'string'
        );

        if (!validIngredients) {
          console.error("Invalid ingredient format detected");
          throw new Error("Invalid ingredient format in suggested changes");
        }

        // Check for duplicates in add mode
        if (mode === 'add') {
          console.log("Adding new ingredients to existing recipe");
          const duplicates = findDuplicateIngredients(recipe.ingredients, items);
          if (duplicates.length > 0) {
            console.error("Duplicate ingredients detected:", duplicates);
            throw new Error(
              `These ingredients (or similar ones) already exist in the recipe: ${
                duplicates.map(d => d.new).join(', ')
              }`
            );
          }
        }

        // Validate quantities
        const quantityValidation = validateIngredientQuantities(recipe, items, mode);
        if (!quantityValidation.valid) {
          console.error("Ingredient quantity validation failed:", quantityValidation.message);
          throw new Error(quantityValidation.message || "Invalid ingredient quantities");
        }
      }
    }

    console.log("Final recipe update ready to save:", {
      id: updatedRecipe.id,
      hasIngredients: updatedRecipe.ingredients?.length > 0,
      ingredientCount: updatedRecipe.ingredients?.length,
      hasInstructions: updatedRecipe.instructions?.length > 0,
      instructionCount: updatedRecipe.instructions?.length
    });
    
    return await saveRecipeUpdate(updatedRecipe);
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}

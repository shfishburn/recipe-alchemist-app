
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { findDuplicateIngredients, validateIngredientQuantities } from './ingredients/ingredient-validation';
import { processRecipeUpdates } from './process-recipe-updates';
import { saveRecipeUpdate } from './db/save-recipe-update';
import { validateRecipeUpdate } from './validation/validate-recipe-update';

export async function updateRecipe(
  recipe: Recipe,
  chatMessage: ChatMessage,
  user_id: string,
  imageUrl: string | null
) {
  // Validate inputs
  validateRecipeUpdate(recipe, chatMessage);
  
  console.log("Starting recipe update with changes:", {
    hasTitle: !!chatMessage.changes_suggested?.title,
    hasIngredients: !!chatMessage.changes_suggested?.ingredients,
    ingredientMode: chatMessage.changes_suggested?.ingredients?.mode,
    ingredientCount: chatMessage.changes_suggested?.ingredients?.items?.length,
    hasInstructions: !!chatMessage.changes_suggested?.instructions,
    hasNutrition: !!chatMessage.changes_suggested?.nutrition
  });

  // Process basic recipe updates
  const updatedRecipe = processRecipeUpdates(recipe, chatMessage);

  // Process ingredients if they exist
  if (chatMessage.changes_suggested?.ingredients?.items) {
    const { mode = 'none', items = [] } = chatMessage.changes_suggested.ingredients;
    console.log("Processing ingredients:", { mode, itemCount: items.length });
    
    if (mode !== 'none' && items.length > 0) {
      // Validate ingredients format
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

      if (mode === 'add') {
        console.log("Adding new ingredients to existing recipe");
        updatedRecipe.ingredients = [...recipe.ingredients, ...items];
      } else if (mode === 'replace') {
        console.log("Replacing all ingredients");
        updatedRecipe.ingredients = items;
      }
    }
  }

  try {
    return await saveRecipeUpdate(updatedRecipe);
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}

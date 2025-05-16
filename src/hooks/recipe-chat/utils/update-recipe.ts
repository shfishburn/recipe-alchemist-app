
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
): Promise<Recipe> {
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
    const updatedRecipeData = processRecipeUpdates(recipe, chatMessage);
    
    // Properly transform data to ensure type safety for ingredients
    // Ensure all required properties from Recipe are included with appropriate defaults
    const updatedRecipe: Recipe = {
      ...recipe, // Start with the original recipe to ensure all properties exist
      ...updatedRecipeData as Partial<Recipe>, // Apply the updates
      // Ensure title is always provided (required in Recipe type)
      title: updatedRecipeData.title || recipe.title || "Untitled Recipe",
      // Ensure instructions array is always present
      instructions: Array.isArray(updatedRecipeData.instructions) ? updatedRecipeData.instructions : recipe.instructions || [],
      // Transform ingredients to ensure they match the Ingredient type requirements
      ingredients: Array.isArray(updatedRecipeData.ingredients)
        ? updatedRecipeData.ingredients.map((ing: any) => ({
            qty_metric: ing.qty_metric || 0,
            unit_metric: ing.unit_metric || '',
            qty_imperial: ing.qty_imperial || 0,
            unit_imperial: ing.unit_imperial || '',
            item: ing.item || '',
            notes: ing.notes,
            shop_size_qty: ing.shop_size_qty,
            shop_size_unit: ing.shop_size_unit,
            qty: ing.qty,
            unit: ing.unit
          }))
        : recipe.ingredients || [],
      // Ensure science_notes is always an array
      science_notes: Array.isArray(updatedRecipeData.science_notes) ? updatedRecipeData.science_notes : recipe.science_notes || []
    };

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
    
    // Save the recipe update and return the updated recipe
    const savedRecipe = await saveRecipeUpdate(updatedRecipe);
    return savedRecipe as Recipe;
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}

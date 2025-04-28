
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';
import { findDuplicateIngredients, validateIngredientQuantities } from './ingredients/ingredient-validation';
import { processRecipeUpdates } from './process-recipe-updates';

export async function updateRecipe(
  recipe: Recipe,
  chatMessage: ChatMessage,
  user_id: string,
  imageUrl: string | null
) {
  if (!chatMessage.changes_suggested) return null;
  
  console.log("Starting recipe update with changes:", {
    hasTitle: !!chatMessage.changes_suggested.title,
    hasIngredients: !!chatMessage.changes_suggested.ingredients,
    ingredientMode: chatMessage.changes_suggested.ingredients?.mode,
    ingredientCount: chatMessage.changes_suggested.ingredients?.items?.length,
    hasInstructions: !!chatMessage.changes_suggested.instructions,
    hasNutrition: !!chatMessage.changes_suggested.nutrition
  });

  // Process basic recipe updates
  const updatedRecipe = processRecipeUpdates(recipe, chatMessage);

  // Process ingredients with enhanced validation
  if (chatMessage.changes_suggested.ingredients?.items) {
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

      // Enhanced duplicate checking in add mode
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

      // Validate quantities against serving size with improved logic
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
    // Properly transform the recipe for Supabase storage
    const dbRecipe = {
      ...updatedRecipe,
      ingredients: updatedRecipe.ingredients as unknown as Json,
      nutrition: updatedRecipe.nutrition as unknown as Json,
      science_notes: updatedRecipe.science_notes as unknown as Json
    };

    const { data, error } = await supabase
      .from('recipes')
      .update(dbRecipe)
      .eq('id', recipe.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
    
    console.log("Recipe successfully updated");
    return data;
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}

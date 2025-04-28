
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';

function validateIngredientQuantities(
  originalRecipe: Recipe,
  newIngredients: any[],
  mode: 'add' | 'replace' | 'none'
): { valid: boolean; message?: string } {
  // If mode is 'none' or no ingredients to validate, return valid
  if (mode === 'none' || newIngredients.length === 0) {
    return { valid: true };
  }
  
  // For replace mode, validate the entire new ingredient list
  const ingredientsToCheck = mode === 'replace' ? newIngredients : [...originalRecipe.ingredients, ...newIngredients];
  
  // Calculate average quantity per serving from original recipe
  const originalAvgQtyPerServing = originalRecipe.ingredients.reduce((acc, ing) => acc + ing.qty, 0) / originalRecipe.servings;
  
  // Calculate new average
  const newAvgQtyPerServing = ingredientsToCheck.reduce((acc, ing) => acc + ing.qty, 0) / originalRecipe.servings;
  
  // Check if the new average is significantly different (more than 3x)
  if (newAvgQtyPerServing > originalAvgQtyPerServing * 3) {
    return {
      valid: false,
      message: `Warning: New ingredient quantities seem too high for ${originalRecipe.servings} servings`
    };
  }

  // Check individual ingredients for unreasonable quantities
  for (const ing of newIngredients) {
    if (ing.qty > 5 && ['lb', 'lbs', 'pound', 'pounds'].includes(ing.unit.toLowerCase())) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high for ${originalRecipe.servings} servings`
      };
    }
  }

  return { valid: true };
}

export async function updateRecipe(
  recipe: Recipe,
  chatMessage: ChatMessage,
  user_id: string,
  imageUrl: string | null
) {
  if (!chatMessage.changes_suggested) return null;
  
  console.log("Starting recipe update with changes:", {
    hasIngredients: !!chatMessage.changes_suggested.ingredients,
    ingredientMode: chatMessage.changes_suggested.ingredients?.mode,
    ingredientCount: chatMessage.changes_suggested.ingredients?.items?.length
  });

  const updatedRecipe: Partial<Recipe> & { id: string } = {
    ...recipe,
    title: chatMessage.changes_suggested.title || recipe.title,
    nutrition: chatMessage.changes_suggested.nutrition || recipe.nutrition,
    image_url: imageUrl ?? recipe.image_url,
    science_notes: chatMessage.changes_suggested.science_notes || recipe.science_notes || [],
    updated_at: new Date().toISOString()
  };

  // Process ingredients with enhanced validation
  if (chatMessage.changes_suggested.ingredients?.items) {
    const { mode = 'none', items } = chatMessage.changes_suggested.ingredients;
    console.log("Processing ingredients:", { mode, itemCount: items.length });
    
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

    // Validate quantities against serving size - now supports 'none' mode
    const quantityValidation = validateIngredientQuantities(recipe, items, mode);
    if (!quantityValidation.valid) {
      console.error("Ingredient quantity validation failed:", quantityValidation.message);
      throw new Error(quantityValidation.message);
    }

    if (mode === 'add' && Array.isArray(items)) {
      console.log("Adding new ingredients to existing recipe");
      updatedRecipe.ingredients = [...recipe.ingredients, ...items];
    } else if (mode === 'replace' && Array.isArray(items)) {
      console.log("Replacing all ingredients");
      updatedRecipe.ingredients = items;
    }
    // For 'none' mode, we don't modify ingredients
  }

  // Process instructions - ensure we always store as string array
  if (chatMessage.changes_suggested.instructions) {
    console.log("Updating instructions");
    updatedRecipe.instructions = chatMessage.changes_suggested.instructions.map(
      instruction => typeof instruction === 'string' ? instruction : instruction.action
    );
  }

  console.log("Final recipe update:", {
    title: updatedRecipe.title,
    ingredientsCount: updatedRecipe.ingredients?.length,
    instructionsCount: updatedRecipe.instructions?.length
  });

  try {
    // Cast our strongly typed objects to Json for database storage
    const dbRecipe = {
      ...updatedRecipe,
      ingredients: updatedRecipe.ingredients as unknown as Json,
      nutrition: updatedRecipe.nutrition as unknown as Json,
      science_notes: updatedRecipe.science_notes as unknown as Json
    };

    const { data: updatedRecipeData, error } = await supabase
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
    return updatedRecipeData;
  } catch (error) {
    console.error("Update recipe error:", error);
    throw error;
  }
}

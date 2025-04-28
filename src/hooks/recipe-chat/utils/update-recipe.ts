
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';

// Helper function to normalize ingredient names for comparison
function normalizeIngredient(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/s$/, ''); // Remove trailing 's' for plurals
}

// Check if two ingredients are similar enough to be considered duplicates
function areSimilarIngredients(ing1: string, ing2: string): boolean {
  const norm1 = normalizeIngredient(ing1);
  const norm2 = normalizeIngredient(ing2);
  
  // Direct match
  if (norm1 === norm2) return true;
  
  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  
  // Could add more sophisticated matching here if needed
  return false;
}

function validateIngredientQuantities(
  originalRecipe: Recipe,
  newIngredients: any[],
  mode: 'add' | 'replace' | 'none'
): { valid: boolean; message?: string } {
  if (mode === 'none' || newIngredients.length === 0) {
    return { valid: true };
  }

  const ingredientsToCheck = mode === 'replace' ? newIngredients : [...originalRecipe.ingredients, ...newIngredients];
  const avgQtyPerServing = originalRecipe.ingredients.reduce((acc, ing) => acc + ing.qty, 0) / originalRecipe.servings;
  const newAvgQtyPerServing = ingredientsToCheck.reduce((acc, ing) => acc + ing.qty, 0) / originalRecipe.servings;

  // Check total quantity ratio
  if (newAvgQtyPerServing > avgQtyPerServing * 3) {
    return {
      valid: false,
      message: `Warning: New quantities seem too high for ${originalRecipe.servings} servings`
    };
  }

  // Check individual ingredients
  for (const ing of newIngredients) {
    const qtyPerServing = ing.qty / originalRecipe.servings;

    // Validate quantity ranges based on common ingredient types
    if (ing.unit.toLowerCase().includes('pound') && qtyPerServing > 1) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }

    if (ing.unit.toLowerCase().includes('cup') && qtyPerServing > 2) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }
  }

  return { valid: true };
}

function findDuplicateIngredients(existingIngredients: Recipe['ingredients'], newIngredients: Recipe['ingredients']) {
  return newIngredients.filter(newIng => 
    existingIngredients.some(existingIng => 
      areSimilarIngredients(existingIng.item, newIng.item)
    )
  );
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

    // Enhanced duplicate checking in add mode
    if (mode === 'add') {
      const duplicates = findDuplicateIngredients(recipe.ingredients, items);
      if (duplicates.length > 0) {
        console.error("Duplicate ingredients detected:", duplicates);
        throw new Error(
          `These ingredients (or similar ones) already exist in the recipe: ${
            duplicates.map(d => d.item).join(', ')
          }`
        );
      }
    }

    // Validate quantities against serving size with improved logic
    const quantityValidation = validateIngredientQuantities(recipe, items, mode);
    if (!quantityValidation.valid) {
      console.error("Ingredient quantity validation failed:", quantityValidation.message);
      throw new Error(quantityValidation.message);
    }

    if (mode === 'add') {
      console.log("Adding new ingredients to existing recipe");
      updatedRecipe.ingredients = [...recipe.ingredients, ...items];
    } else if (mode === 'replace') {
      console.log("Replacing all ingredients");
      updatedRecipe.ingredients = items;
    }
  }

  // Process instructions with better formatting
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

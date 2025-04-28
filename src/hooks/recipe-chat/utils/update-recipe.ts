
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';

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

  const updatedRecipe = {
    ...recipe,
    title: chatMessage.changes_suggested.title || recipe.title,
    nutrition: chatMessage.changes_suggested.nutrition || recipe.nutrition,
    image_url: imageUrl ?? recipe.image_url,
    science_notes: chatMessage.changes_suggested.science_notes || recipe.science_notes || [],
    updated_at: new Date().toISOString()
  };

  // Process ingredients with validation
  if (chatMessage.changes_suggested.ingredients?.items) {
    const { mode, items } = chatMessage.changes_suggested.ingredients;
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

    if (mode === 'add' && Array.isArray(items)) {
      console.log("Adding new ingredients to existing recipe");
      updatedRecipe.ingredients = [...recipe.ingredients, ...items];
    } else if (mode === 'replace' && Array.isArray(items)) {
      console.log("Replacing all ingredients");
      updatedRecipe.ingredients = items;
    }
  }

  // Process instructions
  if (chatMessage.changes_suggested.instructions) {
    console.log("Updating instructions");
    if (typeof chatMessage.changes_suggested.instructions[0] === 'string') {
      updatedRecipe.instructions = chatMessage.changes_suggested.instructions;
    } else {
      updatedRecipe.instructions = chatMessage.changes_suggested.instructions.map(
        instr => typeof instr === 'string' ? instr : instr.action
      );
    }
  }

  console.log("Final recipe update:", {
    title: updatedRecipe.title,
    ingredientsCount: updatedRecipe.ingredients.length,
    instructionsCount: updatedRecipe.instructions.length
  });

  try {
    const { data: updatedRecipeData, error } = await supabase
      .from('recipes')
      .update(updatedRecipe)
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


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
  
  console.log("Updating recipe with changes:", chatMessage.changes_suggested);

  const updatedRecipe = {
    title: chatMessage.changes_suggested.title || recipe.title,
    nutrition: chatMessage.changes_suggested.nutrition || recipe.nutrition,
    image_url: imageUrl ?? recipe.image_url,
    user_id: recipe.user_id || user_id,
    servings: recipe.servings || 4,
    instructions: recipe.instructions,
    ingredients: recipe.ingredients,
    science_notes: chatMessage.changes_suggested.science_notes || recipe.science_notes || []
  };

  // Process instructions
  if (chatMessage.changes_suggested.instructions) {
    console.log("Updating instructions:", chatMessage.changes_suggested.instructions);
    if (typeof chatMessage.changes_suggested.instructions[0] === 'string') {
      updatedRecipe.instructions = chatMessage.changes_suggested.instructions as string[];
    } else {
      updatedRecipe.instructions = (chatMessage.changes_suggested.instructions as Array<{
        stepNumber?: number;
        action: string;
      }>).map(instr => instr.action);
    }
  }

  // Process ingredients
  if (chatMessage.changes_suggested.ingredients) {
    const { mode, items } = chatMessage.changes_suggested.ingredients;
    console.log("Updating ingredients with mode:", mode, "Items:", items);
    
    if (mode === 'add' && items && Array.isArray(items)) {
      console.log("Adding ingredients to existing recipe");
      updatedRecipe.ingredients = [...recipe.ingredients, ...items];
    } else if (mode === 'replace' && items && Array.isArray(items)) {
      console.log("Replacing all ingredients");
      updatedRecipe.ingredients = items;
    } else {
      console.warn("Unhandled ingredients update mode or invalid items:", mode, items);
    }
  }

  console.log("Final updated recipe data:", {
    title: updatedRecipe.title,
    ingredientsCount: updatedRecipe.ingredients.length,
    instructionsCount: updatedRecipe.instructions.length
  });

  try {
    const { data: updatedRecipeData, error } = await supabase
      .from('recipes')
      .update({
        ...updatedRecipe,
        ingredients: updatedRecipe.ingredients as unknown as Json,
        nutrition: updatedRecipe.nutrition as unknown as Json,
        science_notes: updatedRecipe.science_notes as unknown as Json,
        updated_at: new Date().toISOString()
      })
      .eq('id', recipe.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating recipe in database:", error);
      throw error;
    }
    
    console.log("Recipe successfully updated in database");
    return updatedRecipeData;
  } catch (error) {
    console.error("Exception when updating recipe:", error);
    throw error;
  }
}

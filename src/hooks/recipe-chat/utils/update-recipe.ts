
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

  const updatedRecipe = {
    title: chatMessage.changes_suggested.title || recipe.title,
    nutrition: chatMessage.changes_suggested.nutrition || recipe.nutrition,
    image_url: imageUrl ?? recipe.image_url,
    user_id: recipe.user_id || user_id,
    servings: recipe.servings || 4,
  };

  if (chatMessage.changes_suggested.instructions) {
    if (typeof chatMessage.changes_suggested.instructions[0] === 'string') {
      updatedRecipe.instructions = chatMessage.changes_suggested.instructions as string[];
    } else {
      updatedRecipe.instructions = (chatMessage.changes_suggested.instructions as Array<{
        stepNumber?: number;
        action: string;
      }>).map(instr => instr.action);
    }
  }

  if (chatMessage.changes_suggested.ingredients) {
    const { mode, items } = chatMessage.changes_suggested.ingredients;
    if (mode === 'add' && items) {
      updatedRecipe.ingredients = [...recipe.ingredients, ...items];
    } else if (mode === 'replace' && items) {
      updatedRecipe.ingredients = items;
    }
  }

  const { data: updatedRecipeData, error } = await supabase
    .from('recipes')
    .update({
      ...updatedRecipe,
      ingredients: updatedRecipe.ingredients as unknown as Json,
      nutrition: updatedRecipe.nutrition as unknown as Json,
      updated_at: new Date().toISOString()
    })
    .eq('id', recipe.id)
    .select()
    .single();

  if (error) throw error;
  return updatedRecipeData;
}

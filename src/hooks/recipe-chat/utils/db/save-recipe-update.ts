
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';

export async function saveRecipeUpdate(updatedRecipe: Partial<Recipe> & { id: string }) {
  // Transform recipe for database storage
  const dbRecipe = {
    ...updatedRecipe,
    ingredients: updatedRecipe.ingredients as unknown as Json,
    nutrition: updatedRecipe.nutrition as unknown as Json,
    science_notes: updatedRecipe.science_notes as unknown as Json
  };

  const { data, error } = await supabase
    .from('recipes')
    .update(dbRecipe)
    .eq('id', updatedRecipe.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
  
  console.log("Recipe successfully updated");
  return data;
}

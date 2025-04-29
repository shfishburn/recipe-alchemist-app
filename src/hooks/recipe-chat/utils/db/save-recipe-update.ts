
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';
import { ensureRecipeIntegrity } from '../validation/validate-recipe-integrity';

export async function saveRecipeUpdate(updatedRecipe: Partial<Recipe> & { id: string }) {
  // Ensure recipe integrity before saving to database
  ensureRecipeIntegrity(updatedRecipe);
  
  // Transform recipe for database storage
  const dbRecipe = {
    ...updatedRecipe,
    ingredients: updatedRecipe.ingredients as unknown as Json,
    nutrition: updatedRecipe.nutrition as unknown as Json,
    science_notes: updatedRecipe.science_notes as unknown as Json
  };

  console.log("Saving recipe update with data integrity checks passed:", {
    id: dbRecipe.id,
    hasIngredients: Array.isArray(updatedRecipe.ingredients) && updatedRecipe.ingredients.length > 0,
    ingredientCount: Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients.length : 0,
    hasInstructions: Array.isArray(updatedRecipe.instructions) && updatedRecipe.instructions.length > 0,
    instructionCount: Array.isArray(updatedRecipe.instructions) ? updatedRecipe.instructions.length : 0,
    hasNotes: Array.isArray(dbRecipe.science_notes) && dbRecipe.science_notes.length > 0,
    noteCount: Array.isArray(dbRecipe.science_notes) ? dbRecipe.science_notes.length : 0
  });

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
  
  console.log("Recipe successfully updated with ID:", data.id);
  return data;
}

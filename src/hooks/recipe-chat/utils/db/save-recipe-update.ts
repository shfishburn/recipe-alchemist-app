
import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { Recipe } from '@/types/recipe';
import { createErrorResponse, formatErrorMessage } from '@/utils/error-utils';

export async function saveRecipeUpdate(updatedRecipe: Recipe): Promise<Recipe> {
  try {
    // Ensure there's a recipe ID
    if (!updatedRecipe.id) {
      throw new Error('Recipe ID is required for updating');
    }
    
    // Make copy of recipe and add updated timestamp
    const recipeToUpdate = {
      ...updatedRecipe,
      updated_at: new Date().toISOString()
    };
    
    // Remove properties that may cause issues
    const { id, created_at, ...recipeDataWithoutId } = recipeToUpdate;
    
    // Update recipe in database
    const { data, error } = await supabase
      .from('recipes')
      .update(recipeDataWithoutId)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      handleSupabaseError(error, 'update recipe');
    }
    
    // Return updated recipe 
    return data as Recipe;
  } catch (error) {
    const errorMessage = formatErrorMessage(error);
    console.error("Error saving recipe update:", errorMessage);
    throw new Error(`Failed to save recipe update: ${errorMessage}`);
  }
}

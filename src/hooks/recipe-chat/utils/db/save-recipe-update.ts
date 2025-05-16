
import type { Recipe } from '@/types/recipe';
import { supabase } from '@/integrations/supabase/client';

/**
 * Saves recipe updates to the database
 * @param recipe The recipe to update
 * @returns The updated recipe from the database, or null if the update failed
 */
export async function saveRecipeUpdate(recipe: Recipe): Promise<Recipe | null> {
  try {
    console.log("Saving recipe update to database", {
      id: recipe.id,
      title: recipe.title,
    });

    // Remove undefined values to prevent database errors
    const cleanRecipe = Object.fromEntries(
      Object.entries(recipe).filter(([_, v]) => v !== undefined)
    );

    // Ensure proper typing for database operations
    // Convert the recipe to the format expected by the database
    const dbRecipe = {
      ...cleanRecipe,
      // Ensure arrays are properly serialized
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      science_notes: Array.isArray(recipe.science_notes) ? recipe.science_notes : []
    };

    // Update the recipe in the database
    const { data, error } = await supabase
      .from('recipes')
      .update(dbRecipe)
      .eq('id', recipe.id)
      .select()
      .single();

    if (error) {
      console.error("Error saving recipe update:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned from database update");
    }

    // Convert the database response back to Recipe type
    const updatedRecipe: Recipe = {
      ...data,
      // Ensure arrays are properly typed
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      instructions: Array.isArray(data.instructions) ? data.instructions : [],
      science_notes: Array.isArray(data.science_notes) ? data.science_notes : []
    } as Recipe;

    console.log("Recipe update saved successfully");
    return updatedRecipe;
  } catch (error) {
    console.error("Error in saveRecipeUpdate:", error);
    throw error;
  }
}

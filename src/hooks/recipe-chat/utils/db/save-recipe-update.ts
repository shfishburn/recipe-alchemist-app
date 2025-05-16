
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

    // Update the recipe in the database
    const { data, error } = await supabase
      .from('recipes')
      .update(cleanRecipe)
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

    console.log("Recipe update saved successfully");
    return data as Recipe;
  } catch (error) {
    console.error("Error in saveRecipeUpdate:", error);
    throw error;
  }
}

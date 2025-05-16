
import type { Recipe } from '@/types/recipe';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

/**
 * Helper function to convert Recipe object to database-compatible format
 */
function recipeToDbFormat(recipe: Recipe): any {
  return {
    ...recipe,
    // Convert arrays to JSON-compatible format
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients as any : [],
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
    science_notes: Array.isArray(recipe.science_notes) ? recipe.science_notes as any : []
  };
}

/**
 * Helper function to convert database object back to Recipe type
 */
function dbToRecipeFormat(dbData: any): Recipe {
  return {
    ...dbData,
    // Ensure arrays are properly typed
    ingredients: Array.isArray(dbData.ingredients) ? dbData.ingredients : [],
    instructions: Array.isArray(dbData.instructions) ? dbData.instructions : [],
    science_notes: Array.isArray(dbData.science_notes) ? dbData.science_notes : []
  } as Recipe;
}

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

    // Prepare the recipe for database storage by converting to DB format
    const dbRecipe = recipeToDbFormat(cleanRecipe as Recipe);

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
    const updatedRecipe = dbToRecipeFormat(data);

    console.log("Recipe update saved successfully");
    return updatedRecipe;
  } catch (error) {
    console.error("Error in saveRecipeUpdate:", error);
    throw error;
  }
}

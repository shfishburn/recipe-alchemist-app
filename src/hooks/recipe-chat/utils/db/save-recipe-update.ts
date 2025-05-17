
import { supabase } from '@/lib/supabase';
import type { Recipe } from '@/types/recipe';
import type { QuickRecipe } from '@/types/quick-recipe';
import { handleApiError } from '@/utils/error-utils';

/**
 * Ensures recipe has all required fields before saving to database
 */
function ensureCompleteRecipe(recipe: Partial<QuickRecipe> & { id: string }): QuickRecipe {
  // Default values for required fields if missing
  return {
    // Required fields with defaults if missing
    id: recipe.id,
    title: recipe.title || 'Untitled Recipe',
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || recipe.instructions || [],
    instructions: recipe.instructions || recipe.steps || [],
    servings: recipe.servings || 1,

    // Optional fields - use existing or undefined
    description: recipe.description,
    image_url: recipe.image_url,
    prep_time_min: recipe.prep_time_min,
    cook_time_min: recipe.cook_time_min,
    cuisine: recipe.cuisine,
    cuisine_category: recipe.cuisine_category, 
    tags: recipe.tags,
    user_id: recipe.user_id,
    created_at: recipe.created_at,
    updated_at: recipe.updated_at || new Date().toISOString(),
    original_request: recipe.original_request,
    reasoning: recipe.reasoning,
    tagline: recipe.tagline,
    version_number: recipe.version_number,
    previous_version_id: recipe.previous_version_id,
    deleted_at: recipe.deleted_at,
    dietary: recipe.dietary,
    flavor_tags: recipe.flavor_tags,
    nutrition: recipe.nutrition,
    science_notes: recipe.science_notes,
    chef_notes: recipe.chef_notes,
    nutri_score: recipe.nutri_score,
    slug: recipe.slug,
    
    // Additional UI fields
    prepTime: recipe.prepTime || recipe.prep_time_min,
    cookTime: recipe.cookTime || recipe.cook_time_min,
    cookingTip: recipe.cookingTip,
    nutritionHighlight: recipe.nutritionHighlight,
    error_message: recipe.error_message,
    isError: recipe.isError,
    version_info: recipe.version_info,
  };
}

/**
 * Saves recipe updates to database
 * @param recipe Recipe object with updated data
 * @returns Updated recipe with any server-side changes
 */
export async function saveRecipeUpdate(
  recipe: Partial<Recipe> & { id: string }
): Promise<Recipe | null> {
  try {
    console.log("Saving recipe update:", {
      id: recipe.id,
      title: recipe.title,
      hasIngredients: !!recipe.ingredients?.length,
      hasInstructions: !!recipe.instructions?.length
    });
    
    // Convert to complete recipe with all required fields
    const completeRecipe = ensureCompleteRecipe(recipe);

    const { data, error } = await supabase
      .from('recipes')
      .update(completeRecipe)
      .eq('id', recipe.id)
      .select()
      .single();

    if (error) {
      console.error("Error saving recipe update:", error);
      throw new Error(`Failed to save recipe update: ${error.message}`);
    }

    console.log("Recipe update saved successfully:", {
      id: data.id,
      updated_at: data.updated_at
    });

    return data as Recipe;
  } catch (err) {
    const formattedError = handleApiError(err, "Failed to save recipe update");
    console.error("Error in saveRecipeUpdate:", formattedError);
    throw formattedError;
  }
}

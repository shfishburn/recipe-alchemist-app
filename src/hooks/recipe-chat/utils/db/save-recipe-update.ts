
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import { Json } from '@/integrations/supabase/types';
import { standardizeNutrition } from '@/utils/nutrition-utils';

/**
 * Saves recipe updates to the database
 * Handles proper JSON conversions and data validation
 */
export async function saveRecipeUpdate(updatedRecipe: Partial<Recipe> & { id: string }) {
  console.log("Saving recipe update:", updatedRecipe.id);
  
  // Validate that we have the minimum required fields
  if (!updatedRecipe.id) {
    throw new Error("Recipe ID is required");
  }
  
  if (!updatedRecipe.title) {
    throw new Error("Recipe title is required");
  }
  
  if (!updatedRecipe.ingredients || !Array.isArray(updatedRecipe.ingredients) || updatedRecipe.ingredients.length === 0) {
    throw new Error("Recipe must have at least one ingredient");
  }
  
  if (!updatedRecipe.instructions || !Array.isArray(updatedRecipe.instructions) || updatedRecipe.instructions.length === 0) {
    throw new Error("Recipe must have at least one instruction");
  }

  try {
    // Standardize nutrition data if present
    let standardizedNutrition = updatedRecipe.nutrition;
    if (updatedRecipe.nutrition) {
      standardizedNutrition = standardizeNutrition(updatedRecipe.nutrition);
    }
    
    // Process calories from nutrition to update filtered values
    const calculateAverageCalories = () => {
      if (!standardizedNutrition) return null;
      
      // Get calories or kcal field, but avoid using both
      const calorieValue = standardizedNutrition.calories || standardizedNutrition.kcal || 0;
      
      // Apply per-serving adjustment if needed
      return updatedRecipe.servings ? calorieValue / updatedRecipe.servings : calorieValue;
    };
    
    // Prepare database update with proper types for Supabase
    const recipeUpdate = {
      title: updatedRecipe.title,
      description: updatedRecipe.description,
      tagline: updatedRecipe.tagline,
      ingredients: updatedRecipe.ingredients as unknown as Json,
      instructions: updatedRecipe.instructions,
      prep_time_min: updatedRecipe.prep_time_min,
      cook_time_min: updatedRecipe.cook_time_min,
      servings: updatedRecipe.servings,
      image_url: updatedRecipe.image_url,
      cuisine: updatedRecipe.cuisine,
      tags: updatedRecipe.tags,
      nutrition: standardizedNutrition as unknown as Json,
      nutri_score: updatedRecipe.nutri_score as unknown as Json,
      cuisine_category: updatedRecipe.cuisine_category,
      science_notes: updatedRecipe.science_notes as unknown as Json,
      updated_at: new Date().toISOString(),
      chef_notes: updatedRecipe.chef_notes,
      dietary: updatedRecipe.dietary,
      flavor_tags: updatedRecipe.flavor_tags,
      cooking_tip: updatedRecipe.cooking_tip
    };
    
    // Update the recipe
    const { data: updatedData, error: updateError } = await supabase
      .from('recipes')
      .update(recipeUpdate)
      .match({ id: updatedRecipe.id })
      .select()
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    console.log("Recipe updated successfully:", updatedData.id);
    
    return updatedData;
  } catch (error) {
    console.error("Error saving recipe update:", error);
    throw error;
  }
}


import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';
import { ensureRecipeIntegrity } from '../validation/validate-recipe-integrity';
import { standardizeNutrition } from '@/types/nutrition-utils';

export async function saveRecipeUpdate(updatedRecipe: Partial<Recipe> & { id: string }) {
  // Ensure recipe integrity before saving to database
  ensureRecipeIntegrity(updatedRecipe);
  
  // Enhanced nutrition data handling with detailed logging
  if (updatedRecipe.nutrition) {
    console.log("Original nutrition data:", JSON.stringify(updatedRecipe.nutrition));
    
    try {
      // Deep clone the nutrition data to prevent reference issues
      const nutritionCopy = JSON.parse(JSON.stringify(updatedRecipe.nutrition));
      const standardizedNutrition = standardizeNutrition(nutritionCopy);
      
      console.log("Standardized nutrition data:", JSON.stringify(standardizedNutrition));
      
      // Validate that we have actual nutrition data
      if (!standardizedNutrition || 
          typeof standardizedNutrition !== 'object' || 
          Object.keys(standardizedNutrition).length === 0) {
        console.warn("Empty or invalid nutrition data detected, using default empty object");
        updatedRecipe.nutrition = {};
      } else {
        // Ensure all numerical values are valid non-zero numbers
        const minValue = 0.1; // Minimum value for nutrition fields
        
        for (const key in standardizedNutrition) {
          if (typeof standardizedNutrition[key] === 'number') {
            if (isNaN(standardizedNutrition[key]) || standardizedNutrition[key] <= 0) {
              console.warn(`Found invalid value for nutrition field ${key}, setting to minimum value`);
              standardizedNutrition[key] = minValue;
            }
          }
        }
        
        updatedRecipe.nutrition = standardizedNutrition;
      }
    } catch (error) {
      console.error("Error processing nutrition data:", error);
      // Fallback to empty object if there's an error
      updatedRecipe.nutrition = {};
    }
  }
  
  // Transform recipe for database storage with improved type safety
  const dbRecipe = {
    ...updatedRecipe,
    ingredients: updatedRecipe.ingredients as unknown as Json,
    nutrition: updatedRecipe.nutrition as unknown as Json,
    science_notes: updatedRecipe.science_notes as unknown as Json
  };

  console.log("Saving recipe update with data:", {
    id: dbRecipe.id,
    hasIngredients: Array.isArray(updatedRecipe.ingredients) && updatedRecipe.ingredients.length > 0,
    ingredientCount: Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients.length : 0,
    hasInstructions: Array.isArray(updatedRecipe.instructions) && updatedRecipe.instructions.length > 0,
    instructionCount: Array.isArray(updatedRecipe.instructions) ? updatedRecipe.instructions.length : 0,
    hasNotes: Array.isArray(dbRecipe.science_notes) && dbRecipe.science_notes.length > 0,
    noteCount: Array.isArray(dbRecipe.science_notes) ? dbRecipe.science_notes.length : 0,
    hasNutrition: !!dbRecipe.nutrition && Object.keys(dbRecipe.nutrition).length > 0,
    nutritionKeys: !!dbRecipe.nutrition ? Object.keys(dbRecipe.nutrition) : []
  });

  try {
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
  } catch (error) {
    console.error("Database error updating recipe:", error);
    throw error;
  }
}

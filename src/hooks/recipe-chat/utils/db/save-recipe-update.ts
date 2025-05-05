
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { Json } from '@/integrations/supabase/types';
import { ensureRecipeIntegrity } from '../validation/validate-recipe-integrity';
import { standardizeNutrition } from '@/types/nutrition-utils';

// Map cuisine values to cuisine_category enum values
function mapCuisineToCategory(cuisine: string | undefined): "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" {
  if (!cuisine) return "Global";
  
  const lowerCuisine = cuisine.toLowerCase();
  
  // Regional American cuisines
  if (['cajun-creole', 'midwest', 'new-england', 'pacific-northwest', 'southern', 'southwestern', 'tex-mex']
      .some(c => lowerCuisine.includes(c))) {
    return "Regional American";
  }
  
  // European cuisines
  if (['british', 'irish', 'eastern-european', 'french', 'german', 'greek', 'italian', 'mediterranean', 
       'scandinavian', 'nordic', 'spanish']
      .some(c => lowerCuisine.includes(c))) {
    return "European";
  }
  
  // Asian cuisines
  if (['chinese', 'indian', 'japanese', 'korean', 'southeast-asian', 'thai', 'vietnamese']
      .some(c => lowerCuisine.includes(c))) {
    return "Asian";
  }
  
  // Dietary styles
  if (['gluten-free', 'keto', 'low-fodmap', 'mediterranean', 'paleo', 'plant-based', 'vegetarian', 'whole30',
       'vegan', 'dairy-free', 'low-carb']
      .some(c => lowerCuisine.includes(c))) {
    return "Dietary Styles";
  }
  
  // Default
  return "Global";
}

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
        console.warn("Empty or invalid nutrition data detected, using default values");
        updatedRecipe.nutrition = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0
        };
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
      // Fallback to basic nutrition structure
      updatedRecipe.nutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      };
    }
  }
  
  // Handle cuisine_category enum value
  if (updatedRecipe.cuisine) {
    updatedRecipe.cuisine_category = mapCuisineToCategory(updatedRecipe.cuisine);
    console.log(`Mapped cuisine '${updatedRecipe.cuisine}' to category: ${updatedRecipe.cuisine_category}`);
  }
  
  // Process science_notes to ensure it's always a valid array of strings
  const scienceNotes = Array.isArray(updatedRecipe.science_notes) 
    ? updatedRecipe.science_notes.map(note => (note !== null && note !== undefined) ? String(note) : '')
    : (updatedRecipe.science_notes ? [String(updatedRecipe.science_notes)] : []);
  
  // Transform recipe for database storage with improved type safety
  const dbRecipe = {
    ...updatedRecipe,
    ingredients: updatedRecipe.ingredients as unknown as Json,
    nutrition: updatedRecipe.nutrition as unknown as Json,
    science_notes: scienceNotes as unknown as Json
  };

  console.log("Saving recipe update with data:", {
    id: dbRecipe.id,
    hasIngredients: Array.isArray(updatedRecipe.ingredients) && updatedRecipe.ingredients.length > 0,
    ingredientCount: Array.isArray(updatedRecipe.ingredients) ? updatedRecipe.ingredients.length : 0,
    hasInstructions: Array.isArray(updatedRecipe.instructions) && updatedRecipe.instructions.length > 0,
    instructionCount: Array.isArray(updatedRecipe.instructions) ? updatedRecipe.instructions.length : 0,
    hasNotes: Array.isArray(scienceNotes) && scienceNotes.length > 0,
    noteCount: scienceNotes.length,
    hasNutrition: !!dbRecipe.nutrition && Object.keys(dbRecipe.nutrition).length > 0,
    nutritionKeys: !!dbRecipe.nutrition ? Object.keys(dbRecipe.nutrition) : [],
    cuisine: updatedRecipe.cuisine,
    cuisine_category: updatedRecipe.cuisine_category
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

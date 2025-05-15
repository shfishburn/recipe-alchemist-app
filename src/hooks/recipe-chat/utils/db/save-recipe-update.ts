
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import { ensureRecipeIntegrity } from '../validation/validate-recipe-integrity';
import { transformRecipeForDb } from '@/utils/db-transformers';

// Get the correct cuisine category based on cuisine value
function getCuisineCategory(cuisine: string | undefined): "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern" {
  if (!cuisine) return "Global";
  
  const lowerCuisine = cuisine.toLowerCase();
  
  // Regional American cuisines
  if (['cajun-creole', 'midwest', 'new-england', 'pacific-northwest', 'southern', 'southwestern', 'tex-mex', 'mexican']
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
  if (['gluten-free', 'keto', 'low-fodmap', 'paleo', 'plant-based', 'vegetarian', 'whole30',
       'vegan', 'dairy-free', 'low-carb']
      .some(c => lowerCuisine.includes(c))) {
    return "Dietary Styles";
  }

  // Middle Eastern cuisines
  if (['middle-eastern', 'lebanese', 'turkish', 'persian', 'moroccan']
      .some(c => lowerCuisine.includes(c))) {
    return "Middle Eastern";
  }
  
  // Default
  return "Global";
}

/**
 * Creates a safe preview string from a JSON value
 * @param jsonValue - The JSON value to preview
 * @param maxLength - Maximum length of the preview (default is 100)
 * @returns A string preview of the JSON value
 */
function createSafeJsonPreview(jsonValue: any, maxLength: number = 100): string {
  if (jsonValue === null || jsonValue === undefined) {
    return '[null or undefined]';
  }
  
  if (typeof jsonValue === 'string') {
    return jsonValue.substring(0, maxLength);
  }
  
  if (typeof jsonValue === 'object' || Array.isArray(jsonValue)) {
    try {
      return JSON.stringify(jsonValue).substring(0, maxLength);
    } catch (e) {
      // Security improvement: Log only the error message, not the entire error object
      console.error('Error serializing JSON value for preview:', e instanceof Error ? e.message : 'Unknown error');
      return '[complex object]';
    }
  }
  
  // For numbers, booleans, etc.
  return String(jsonValue).substring(0, maxLength);
}

export async function saveRecipeUpdate(updatedRecipe: Partial<Recipe> & { id: string }) {
  // Ensure recipe integrity before saving to database
  ensureRecipeIntegrity(updatedRecipe);
  
  // Handle cuisine_category enum value
  if (updatedRecipe.cuisine) {
    updatedRecipe.cuisine_category = getCuisineCategory(updatedRecipe.cuisine);
    console.log(`Determined cuisine category: ${updatedRecipe.cuisine_category} for cuisine: ${updatedRecipe.cuisine}`);
  }
  
  // Transform recipe for database storage with improved type safety
  const dbRecipe = transformRecipeForDb(updatedRecipe);

  console.log("Saving recipe update with data:", {
    id: dbRecipe.id,
    hasIngredients: dbRecipe.ingredients ? true : false,
    hasInstructions: dbRecipe.instructions ? true : false,
    cuisine: updatedRecipe.cuisine,
    cuisine_category: dbRecipe.cuisine_category
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

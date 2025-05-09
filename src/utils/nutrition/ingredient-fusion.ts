
import { supabase } from "@/integrations/supabase/client";
import { NutrientValue, FuseNutritionRequest, FuseNutritionResponse } from "./types";

/**
 * Function to call the fusion edge function and get combined nutrition data
 */
export async function fuseIngredientNutrition(
  ingredient: string | { item: string },
  alternativeValues?: NutrientValue[],
  cookingMethod?: string
): Promise<FuseNutritionResponse | null> {
  try {
    // Extract ingredient text from either string or Ingredient object
    const ingredientText = typeof ingredient === 'string' 
      ? ingredient 
      : ingredient.item;
    
    // Create the request payload
    const payload: FuseNutritionRequest = {
      ingredient_text: ingredientText,
    };
    
    // Add optional parameters if provided
    if (alternativeValues && alternativeValues.length > 0) {
      payload.alt_source_values = alternativeValues;
    }
    
    if (cookingMethod) {
      payload.cooking_method = cookingMethod;
    }
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke('fuse-nutrition', {
      body: payload
    });
    
    if (error) {
      console.error('Error calling fuse-nutrition:', error);
      return null;
    }
    
    return data as FuseNutritionResponse;
  } catch (error) {
    console.error('Error in fuseIngredientNutrition:', error);
    return null;
  }
}


import { supabase } from '@/integrations/supabase/client';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';
import { formatRequestBody } from './quick-recipe/format-utils';
import { fetchFromEdgeFunction, fetchFromSupabaseFunctions } from './quick-recipe/api-utils';
import { processErrorResponse } from './quick-recipe/error-utils';

// Function to generate a quick recipe with optimized approach
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    if (!formData.mainIngredient) {
      throw new Error("Please provide a main ingredient");
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function");
    
    let data;
    try {
      // Try the direct fetch first with a 90-second timeout
      data = await fetchFromEdgeFunction(requestBody, 90000);
    } catch (directFetchError) {
      console.warn("Direct fetch failed, trying Supabase invoke:", directFetchError);
      
      // Only if direct fetch fails, try the Supabase invoke method as fallback
      data = await fetchFromSupabaseFunctions(requestBody);
    }
    
    // Check for error in data
    if (!data) {
      console.error('No data returned from recipe generation');
      throw new Error('No recipe data returned. Please try again.');
    }
    
    if (data.error) {
      console.error('Error in recipe data:', data.error);
      throw new Error(data.error);
    }
    
    // Normalize the recipe data to ensure it matches our expected structure
    const normalizedRecipe = normalizeRecipeResponse(data);
    
    console.log('Recipe generation successful');
    
    return normalizedRecipe;
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    return processErrorResponse(error);
  }
};

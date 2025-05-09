
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';
import { createTimeoutPromise } from './quick-recipe/timeout-utils';
import { formatRequestBody } from './quick-recipe/format-utils';
import { fetchFromEdgeFunction, fetchFromSupabaseFunctions } from './quick-recipe/api-utils';
import { processErrorResponse } from './quick-recipe/error-utils';

// Function to generate a quick recipe
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    if (!formData.mainIngredient) {
      throw new Error("Please provide a main ingredient");
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Set a timeout for the request (90 seconds - increased from 60)
    const timeoutPromise = createTimeoutPromise(90000);
    
    // Create a direct fetch function that we'll race against the timeout
    const directFetchPromise = async () => {
      return await fetchFromEdgeFunction(requestBody);
    };
    
    // Race both approaches against the timeout
    const data = await Promise.race([
      directFetchPromise().catch(err => {
        console.warn("Direct fetch failed, trying Supabase invoke:", err);
        return fetchFromSupabaseFunctions(requestBody);
      }),
      timeoutPromise
    ]);
    
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
    
    console.log('Normalized recipe:', normalizedRecipe);
    
    return normalizedRecipe;
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    return processErrorResponse(error);
  }
};


import { supabase } from '@/integrations/supabase/client';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';
import { createTimeoutPromise } from './quick-recipe/timeout-utils';
import { formatRequestBody } from './quick-recipe/format-utils';
import { fetchFromEdgeFunction, fetchFromSupabaseFunctions } from './quick-recipe/api-utils';
import { processErrorResponse } from './quick-recipe/error-utils';

// Type for request options
interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
}

// Function to generate a quick recipe
export const generateQuickRecipe = async (
  formData: QuickRecipeFormData, 
  options: RequestOptions = {}
): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    if (!formData.mainIngredient) {
      throw new Error("Please provide a main ingredient");
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Set a timeout for the request (90 seconds - increased from 60)
    const timeoutPromise = createTimeoutPromise(options?.timeout || 90000);
    
    // Create a direct fetch function that we'll race against the timeout
    const directFetchPromise = async () => {
      return await fetchFromEdgeFunction(requestBody, options?.signal);
    };
    
    // Race both approaches against the timeout
    const data = await Promise.race([
      directFetchPromise().catch(err => {
        // Check if this is an abort error
        if (err.name === 'AbortError') {
          console.log("Request aborted by user");
          throw err; // Re-throw abort errors
        }
        
        console.warn("Direct fetch failed, trying Supabase invoke:", err);
        return fetchFromSupabaseFunctions(requestBody, options?.signal);
      }),
      timeoutPromise
    ]);
    
    // Check for abort signal before continuing
    if (options?.signal?.aborted) {
      throw new DOMException("Recipe generation aborted by user", "AbortError");
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
    
    console.log('Normalized recipe:', normalizedRecipe);
    
    return normalizedRecipe;
  } catch (error: any) {
    // Check if this is an abort error
    if (error.name === 'AbortError') {
      console.log("Request aborted by user");
      throw error; // Re-throw abort errors
    }
    
    console.error('Error in generateQuickRecipe:', error);
    return processErrorResponse(error);
  }
};

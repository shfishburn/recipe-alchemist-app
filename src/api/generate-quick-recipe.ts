
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
    
    // Check if request already aborted
    if (options?.signal?.aborted) {
      console.log("Request aborted before starting");
      throw new DOMException("Recipe generation aborted by user", "AbortError");
    }
    
    if (!formData.mainIngredient) {
      throw new Error("Please provide a main ingredient");
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Set a reduced timeout for the request (40 seconds - reduced from 90)
    const timeoutPromise = createTimeoutPromise(options?.timeout || 40000);
    
    // Create a direct fetch function that we'll race against the timeout
    const directFetchPromise = async () => {
      // Pass the abort signal to fetchFromEdgeFunction
      return await fetchFromEdgeFunction(requestBody, options?.signal);
    };
    
    // Add abort signal listener to log when aborted
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        console.log("AbortSignal detected in generateQuickRecipe");
      });
    }
    
    // Race both approaches against the timeout
    const data = await Promise.race([
      directFetchPromise().catch(err => {
        // Check if this is an abort error
        if (err.name === 'AbortError') {
          console.log("Direct fetch aborted by user");
          throw err; // Re-throw abort errors
        }
        
        console.warn("Direct fetch failed, trying Supabase invoke:", err);
        // Pass the abort signal to fetchFromSupabaseFunctions
        return fetchFromSupabaseFunctions(requestBody, options?.signal);
      }),
      timeoutPromise
    ]);
    
    // Check for abort signal before continuing
    if (options?.signal?.aborted) {
      console.log("Recipe generation aborted after data received");
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
      console.log("Recipe generation aborted in catch block");
      throw error; // Re-throw abort errors
    }
    
    // Log the error for debugging
    console.error('Error in generateQuickRecipe:', error);
    
    // If it's a timeout error, provide a clearer message
    if (error.message && error.message.includes('timed out')) {
      throw new Error("Recipe generation timed out. Please try again.");
    }
    
    return processErrorResponse(error);
  }
};

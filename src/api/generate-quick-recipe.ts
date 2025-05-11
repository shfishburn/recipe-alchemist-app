
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';
import { createTimeoutPromise } from './quick-recipe/timeout-utils';
import { formatRequestBody } from './quick-recipe/format-utils';
import { fetchFromEdgeFunction, fetchFromSupabaseFunctions, getAuthToken } from './quick-recipe/api-utils';
import { processErrorResponse } from './quick-recipe/error-utils';
import { callSupabaseFunction } from './supabaseFunctionClient';

// Function to generate a quick recipe
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    if (!formData.mainIngredient) {
      const errorResponse = await processErrorResponse(new Error("Please provide a main ingredient"));
      return errorResponse as QuickRecipe;
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Set a timeout for the request (120 seconds)
    const timeoutPromise = createTimeoutPromise(120000);
    
    // Create a function to call using our utility
    const callWithSupabaseFunctionClient = async () => {
      const token = await getAuthToken();
      console.log("Got auth token:", token ? "token exists" : "no token");
      
      const response = await callSupabaseFunction<typeof requestBody, any>('generate-quick-recipe', {
        payload: requestBody,
        token,
        debugTag: 'direct-fetch-production'
      });
      
      if (response.error) {
        console.error("Supabase function error:", response.error);
        // Return the error response instead of throwing
        return processErrorResponse(new Error(response.error));
      }
      
      console.log("Supabase function response:", response);
      return response.data;
    };
    
    // Race both approaches against the timeout
    console.log("Starting race with timeout");
    const data = await Promise.race([
      callWithSupabaseFunctionClient().catch(err => {
        console.warn("Supabase function client failed, falling back to direct fetch:", err);
        return fetchFromEdgeFunction(requestBody);
      }),
      timeoutPromise
    ]);
    
    console.log("Race completed, data received:", data ? "data exists" : "no data");
    
    // Check for error in data
    if (!data) {
      console.error('No data returned from recipe generation');
      return processErrorResponse(new Error('No recipe data returned. Please try again.')) as QuickRecipe;
    }
    
    // Check for error or isError flag in data (for our error objects)
    if (typeof data === 'object' && data !== null) {
      if ('isError' in data && data.isError) {
        console.log("Received error object from processing:", data);
        return data as QuickRecipe;
      }
      
      if ('error' in data && data.error) {
        console.error('Error in recipe data:', data.error);
        return processErrorResponse(
          typeof data.error === 'string' ? new Error(data.error) : new Error('Error generating recipe')
        ) as QuickRecipe;
      }
    }
    
    // Normalize the recipe data to ensure it matches our expected structure
    const normalizedRecipe = normalizeRecipeResponse(data);
    
    console.log('Normalized recipe:', normalizedRecipe);
    
    return normalizedRecipe;
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    
    // Return an error recipe object instead of throwing
    return processErrorResponse(error) as QuickRecipe;
  }
};


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
        const errorObj = await processErrorResponse(new Error(response.error));
        return errorObj;
      }
      
      console.log("Supabase function response:", response);
      return response.data;
    };
    
    // Race both approaches against the timeout
    console.log("Starting race with timeout");
    const data = await Promise.race([
      callWithSupabaseFunctionClient().catch(async err => {
        console.warn("Supabase function client failed, falling back to direct fetch:", err);
        return fetchFromEdgeFunction(requestBody);
      }),
      timeoutPromise
    ]);
    
    console.log("Race completed, data received:", data ? "data exists" : "no data");
    
    // Simplified error handling - less aggressive checks
    if (!data) {
      console.error('No data returned from recipe generation');
      const errorObj = await processErrorResponse(new Error('No recipe data returned. Please try again.'));
      return errorObj as QuickRecipe;
    }
    
    // Check for error or isError flag in data
    if (typeof data === 'object' && data !== null && 'isError' in data && data.isError) {
      console.log("Received error object from processing:", data);
      return data as QuickRecipe;
    }
    
    // Normalize the recipe data with more forgiving validation
    const normalizedRecipe = normalizeRecipeResponse(data);
    
    console.log('Normalized recipe:', normalizedRecipe);
    
    return normalizedRecipe;
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    
    // Return an error recipe object instead of throwing
    const errorObj = await processErrorResponse(error);
    return errorObj as QuickRecipe;
  }
};

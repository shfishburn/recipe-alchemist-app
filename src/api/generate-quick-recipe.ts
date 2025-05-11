
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
      // Create a minimal recipe with error info instead of throwing
      const errorRecipe = normalizeRecipeResponse({
        title: "Missing Ingredient",
        description: "Please provide a main ingredient",
        ingredients: [],
        steps: ["Please enter at least one main ingredient to generate a recipe."],
        error_message: "Please provide a main ingredient"
      });
      return errorRecipe;
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
        // Return a recipe with embedded error info
        return normalizeRecipeResponse({
          title: "Recipe Generation Issue",
          description: response.error,
          ingredients: [],
          steps: ["There was an issue creating your recipe: " + response.error],
          error_message: response.error
        });
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
    
    // Handle missing data
    if (!data) {
      console.error('No data returned from recipe generation');
      // Create a minimal recipe with error info
      return normalizeRecipeResponse({
        title: "Recipe Generation Failed",
        description: "No recipe data returned",
        ingredients: [],
        steps: ["No recipe data could be generated. Please try again."],
        error_message: "No recipe data returned. Please try again."
      });
    }
    
    // REMOVED: Check for isError flag
    
    // Normalize the recipe data with more forgiving validation
    const normalizedRecipe = normalizeRecipeResponse(data);
    
    console.log('Normalized recipe:', normalizedRecipe);
    
    return normalizedRecipe;
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    
    // Create a recipe with error information embedded instead of throwing
    return normalizeRecipeResponse({
      title: "Recipe Generation Error",
      description: error.message || "Unknown error occurred",
      ingredients: [],
      steps: ["An error occurred while generating the recipe: " + (error.message || "Unknown error")],
      error_message: error.message || "Unknown error occurred"
    });
  }
};


import { supabase } from '@/integrations/supabase/client';
import { QuickRecipe, QuickRecipeFormData } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';
import { createTimeoutPromise } from './quick-recipe/timeout-utils';
import { formatRequestBody } from './quick-recipe/format-utils';
import { fetchFromEdgeFunction, fetchFromSupabaseFunctions, getAuthToken } from './quick-recipe/api-utils';
import { processErrorResponse } from './quick-recipe/error-utils';
import { callSupabaseFunction } from './supabaseFunctionClient';

// Function to create error recipe with standard format
const createErrorRecipe = (title: string, message: string, servings = 2): QuickRecipe => ({
  id: `error-${Date.now()}`,
  title,
  description: message,
  ingredients: [],
  steps: [message],
  instructions: [message],
  error_message: message,
  isError: true,
  servings
});

// Function to generate a quick recipe
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    if (!formData.mainIngredient) {
      return createErrorRecipe(
        "Missing Ingredient", 
        "Please provide a main ingredient"
      );
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Network status check before making request
    if (!navigator.onLine) {
      return createErrorRecipe(
        "Network Error", 
        "You appear to be offline. Please check your internet connection and try again."
      );
    }
    
    // Set a timeout for the request (120 seconds)
    const timeoutPromise = createTimeoutPromise(120000);
    
    // Create a function to call using our utility
    const callWithSupabaseFunctionClient = async () => {
      try {
        const token = await getAuthToken();
        console.log("Got auth token:", token ? "token exists" : "no token");
        
        const response = await callSupabaseFunction<typeof requestBody, any>('generate-quick-recipe', {
          payload: requestBody,
          token,
          debugTag: 'direct-fetch-production'
        });
        
        if (response.error) {
          console.error("Supabase function error:", response.error);
          return createErrorRecipe(
            "Recipe Generation Issue",
            response.error
          );
        }
        
        console.log("Supabase function response:", response);
        return response.data;
      } catch (err) {
        console.error("Error in callWithSupabaseFunctionClient:", err);
        throw err;
      }
    };
    
    // Race both approaches against the timeout
    console.log("Starting race with timeout");
    
    try {
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
        return createErrorRecipe(
          "Recipe Generation Failed",
          "No recipe data returned"
        );
      }
      
      // Explicitly check for error flags in response
      if (data.isError === true || data.error || data.error_message) {
        console.log("Response contains error flags:", data.error || data.error_message);
        
        // Create a proper QuickRecipe with error info
        const errorRecipe: QuickRecipe = {
          id: `error-${Date.now()}`,
          title: data.title || "Recipe Generation Error",
          description: data.description || data.error || data.error_message,
          ingredients: data.ingredients || [],
          steps: data.steps || [data.error_message || "An error occurred"],
          instructions: data.instructions || [data.error_message || "An error occurred"],
          servings: data.servings || 2,
          error_message: data.error_message || data.error,
          isError: true
        };
        
        return errorRecipe;
      }
      
      // Normalize the recipe data with more forgiving validation
      const normalizedRecipe = normalizeRecipeResponse(data);
      
      console.log('Normalized recipe:', normalizedRecipe);
      
      return normalizedRecipe;
    } catch (raceError: any) {
      console.error("Race error:", raceError);
      
      // Check if it's a timeout error
      if (raceError.message && raceError.message.includes("timeout")) {
        return createErrorRecipe(
          "Recipe Generation Timed Out",
          "The request took too long to complete. Please try again."
        );
      }
      
      // CORS specific error handling
      if (raceError.message && raceError.message.includes("CORS")) {
        return createErrorRecipe(
          "Connection Error",
          "We're having trouble connecting to our recipe service."
        );
      }
      
      // General error handler
      return createErrorRecipe(
        "Recipe Generation Error",
        raceError.message || "An error occurred during recipe generation"
      );
    }
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    
    return createErrorRecipe(
      "Recipe Generation Error",
      error.message || "Unknown error occurred"
    );
  }
};

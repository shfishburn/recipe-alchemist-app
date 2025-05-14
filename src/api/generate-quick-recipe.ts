
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
      const errorRecipe = {
        title: "Missing Ingredient",
        description: "Please provide a main ingredient",
        ingredients: [],
        steps: ["Please enter at least one main ingredient to generate a recipe."],
        error_message: "Please provide a main ingredient",
        isError: true,
        servings: 2
      };
      return errorRecipe;
    }
    
    // Format the request body
    const requestBody = formatRequestBody(formData);
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Network status check before making request
    if (!navigator.onLine) {
      console.error("Network is offline");
      return {
        title: "Network Error",
        description: "You appear to be offline. Please check your internet connection and try again.",
        ingredients: [],
        steps: ["Please check your internet connection and try again."],
        error_message: "You appear to be offline. Please check your internet connection and try again.",
        isError: true,
        servings: 2
      };
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
          // Return a recipe with embedded error info
          return {
            title: "Recipe Generation Issue",
            description: response.error,
            ingredients: [],
            steps: ["There was an issue creating your recipe: " + response.error],
            error_message: response.error,
            isError: true,
            servings: 2
          };
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
      // Fix: Use a mutable variable instead of a constant for data
      let responseData = await Promise.race([
        callWithSupabaseFunctionClient().catch(async err => {
          console.warn("Supabase function client failed, falling back to direct fetch:", err);
          return fetchFromEdgeFunction(requestBody);
        }),
        timeoutPromise
      ]);
      
      console.log("Race completed, data received:", responseData ? "data exists" : "no data");
      
      // Handle missing data
      if (!responseData) {
        console.error('No data returned from recipe generation');
        // Create a minimal recipe with error info
        return {
          title: "Recipe Generation Failed",
          description: "No recipe data returned",
          ingredients: [],
          steps: ["No recipe data could be generated. Please try again."],
          error_message: "No recipe data returned. Please try again.",
          isError: true,
          servings: 2
        };
      }
      
      // Explicitly check for error flags in response
      if (responseData.isError === true || responseData.error || responseData.error_message) {
        console.log("Response contains error flags:", responseData.error || responseData.error_message);
        return {
          ...responseData,
          isError: true // Ensure isError flag is set
        };
      }
      
      // Quick validation of data structure before normalization
      if (responseData.item && responseData.qty_imperial && !responseData.title) {
        console.warn("Received single ingredient instead of complete recipe:", responseData);
        responseData = {
          title: formData.mainIngredient 
            ? `${formData.mainIngredient.charAt(0).toUpperCase() + formData.mainIngredient.slice(1)} Recipe` 
            : "Recipe",
          ingredients: [responseData], // Wrap the single ingredient in an array
          steps: ["Prepare and cook according to your preference."],
          servings: formData.servings || 2
        };
      }
      
      // Normalize the recipe data with more forgiving validation
      const normalizedRecipe = normalizeRecipeResponse(responseData);
      
      console.log('Normalized recipe:', normalizedRecipe);
      
      // If after normalization we still don't have a proper recipe, create a fallback one
      if (!normalizedRecipe.title || normalizedRecipe.ingredients.length === 0 || normalizedRecipe.steps.length === 0) {
        console.warn("Normalized recipe is still incomplete:", normalizedRecipe);
        return {
          title: formData.mainIngredient 
            ? `${formData.mainIngredient.charAt(0).toUpperCase() + formData.mainIngredient.slice(1)} Recipe` 
            : "Recipe",
          description: "A recipe was generated but may be incomplete.",
          ingredients: normalizedRecipe.ingredients.length > 0 ? normalizedRecipe.ingredients : [{
            item: formData.mainIngredient || "Main Ingredient",
            qty_imperial: 1,
            unit_imperial: "serving",
            qty_metric: 1,
            unit_metric: "serving"
          }],
          steps: normalizedRecipe.steps.length > 0 ? normalizedRecipe.steps : [
            "Prepare ingredients according to your preference.",
            "Cook and serve as desired."
          ],
          instructions: normalizedRecipe.instructions.length > 0 ? normalizedRecipe.instructions : [
            "Prepare ingredients according to your preference.",
            "Cook and serve as desired."
          ],
          servings: formData.servings || 2,
          error_message: null,
          isError: false
        };
      }
      
      return normalizedRecipe;
    } catch (raceError) {
      console.error("Race error:", raceError);
      
      // Check if it's a timeout error
      if (raceError.message && raceError.message.includes("timeout")) {
        return {
          title: "Recipe Generation Timed Out",
          description: "The request took too long to complete. Please try again.",
          ingredients: [],
          steps: ["The recipe generation process timed out. This could be due to high server load or complexity of the recipe. Please try again with simpler ingredients."],
          error_message: raceError.message,
          isError: true,
          servings: 2
        };
      }
      
      // CORS specific error handling
      if (raceError.message && raceError.message.includes("CORS")) {
        return {
          title: "Connection Error",
          description: "We're having trouble connecting to our recipe service.",
          ingredients: [],
          steps: ["There was a network error connecting to our recipe service. Please try again later."],
          error_message: "CORS error: Unable to connect to recipe service. This is likely a temporary issue.",
          isError: true,
          servings: 2
        };
      }
      
      // General error handler
      return {
        title: "Recipe Generation Error",
        description: raceError.message || "An error occurred during recipe generation",
        ingredients: [],
        steps: ["There was an error generating your recipe: " + (raceError.message || "Unknown error")],
        error_message: raceError.message || "Unknown error occurred",
        isError: true,
        servings: 2
      };
    }
  } catch (error: any) {
    console.error('Error in generateQuickRecipe:', error);
    
    // Create a recipe with error information embedded
    return {
      title: "Recipe Generation Error",
      description: error.message || "Unknown error occurred",
      ingredients: [],
      steps: ["An error occurred while generating the recipe: " + (error.message || "Unknown error")],
      error_message: error.message || "Unknown error occurred",
      isError: true,
      servings: 2
    };
  }
};

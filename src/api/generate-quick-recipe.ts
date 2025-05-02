
import { supabase } from '@/integrations/supabase/client';
import { QuickRecipeFormData, QuickRecipe } from '@/types/quick-recipe';
import { normalizeRecipeResponse } from '@/utils/recipe-normalization';

// Function to generate a quick recipe
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    console.log("Generating quick recipe with form data:", formData);
    
    if (!formData.mainIngredient) {
      throw new Error("Please provide a main ingredient");
    }
    
    // Ensure servings is set to a default value if not provided
    const servings = formData.servings || 2;
    
    // Increase timeout for the request to prevent premature timeouts
    const TIMEOUT_DURATION = 60000; // 60 seconds timeout
    
    // Set a timeout for the request to prevent indefinite loading
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Recipe generation timed out. Please try again.")), TIMEOUT_DURATION);
    });
    
    // Process cuisine values properly
    let cuisineValue: string | string[] = formData.cuisine;
    if (typeof cuisineValue === 'string') {
      if (cuisineValue.toLowerCase() === 'any') {
        cuisineValue = [];
      } else if (cuisineValue) {
        cuisineValue = cuisineValue.split(',').map(c => c.trim()).filter(Boolean);
      }
    }
    
    // Process dietary values properly
    let dietaryValue: string | string[] = formData.dietary;
    if (typeof dietaryValue === 'string') {
      if (dietaryValue.toLowerCase() === 'any') {
        dietaryValue = [];
      } else if (dietaryValue) {
        dietaryValue = dietaryValue.split(',').map(d => d.trim()).filter(Boolean);
      }
    }
    
    // Format both cuisine and dietary as comma-separated strings for the API
    const cuisineString = Array.isArray(cuisineValue) 
      ? cuisineValue.join(', ') 
      : cuisineValue || "";
    
    const dietaryString = Array.isArray(dietaryValue) 
      ? dietaryValue.join(', ') 
      : dietaryValue || "";
    
    console.log("Processed values:", { 
      cuisineOriginal: formData.cuisine, 
      cuisineProcessed: cuisineString,
      dietaryOriginal: formData.dietary,
      dietaryProcessed: dietaryString 
    });
    
    // Define the request body with properly formatted values
    const requestBody = {
      cuisine: cuisineString || "Any",
      dietary: dietaryString || "",
      mainIngredient: formData.mainIngredient.trim(),
      servings: servings,
      maxCalories: formData.maxCalories
    };
    
    console.log("Sending request to edge function with body:", JSON.stringify(requestBody));
    
    // Create a direct fetch function that we'll race against the timeout
    const directFetchPromise = async () => {
      try {
        // Get auth token for request
        const token = await supabase.auth.getSession().then(res => res.data.session?.access_token || '');
        
        console.log("Testing direct fetch to edge function");
        
        // Make the direct fetch request
        const response = await fetch('https://zjyfumqfrtppleftpzjd.supabase.co/functions/v1/generate-quick-recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Debug-Info': 'direct-fetch-production-' + Date.now()
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log("Direct fetch response status:", response.status);
        const responseText = await response.text();
        console.log("Direct fetch response:", responseText);
        
        // Check if the response is OK
        if (!response.ok) {
          try {
            const errorJson = JSON.parse(responseText);
            throw new Error(errorJson.error || `API returned status ${response.status}`);
          } catch (e) {
            throw new Error(`API returned status ${response.status}: ${responseText.substring(0, 100)}`);
          }
        }
        
        // Parse and return the successful response
        try {
          const data = JSON.parse(responseText);
          console.log("Direct fetch parsed JSON:", data);
          return data;
        } catch (parseError) {
          console.error("Direct fetch response is not valid JSON:", responseText);
          throw new Error("Invalid JSON response from API");
        }
      } catch (fetchError) {
        console.error("Direct fetch error:", fetchError);
        throw fetchError;
      }
    };
    
    // Try with Supabase functions API as fallback
    const supabaseFetchPromise = async () => {
      const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
        body: requestBody,
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': 'supabase-invoke-' + Date.now()
        }
      });

      if (error) {
        console.error('Supabase functions error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from recipe generation');
      }

      return data;
    };
    
    // Race both approaches against the timeout
    const data = await Promise.race([
      directFetchPromise().catch(err => {
        console.warn("Direct fetch failed, trying Supabase invoke:", err);
        return supabaseFetchPromise();
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
    // Check if the error is from Supabase Functions
    if (error.name === "FunctionsError" || error.name === "FunctionsHttpError") {
      console.error("Supabase Functions error details:", {
        name: error.name,
        message: error.message,
        context: error.context || "No context",
        status: error.status || "No status",
      });
      
      if (error.context?.response) {
        try {
          // Log full response information
          console.error('Error response status:', error.context.response.status);
          
          const responseClone = error.context.response.clone();
          const errorResponseText = await responseClone.text();
          console.error('Full error response:', errorResponseText);
          
          try {
            // Try to parse the response text as JSON
            const errorResponseBody = JSON.parse(errorResponseText);
            console.error("Error response body:", errorResponseBody);
            
            // Use the error message from the response body if available
            if (errorResponseBody.error) {
              throw new Error(errorResponseBody.error);
            }
          } catch (parseError) {
            console.error("Could not parse error response:", parseError);
          }
        } catch (e) {
          console.error("Could not read response body:", e);
        }
      }
    }
    
    // Add more context to the error message
    let errorMessage = error.message || "Unknown error occurred";
    
    if (error.message?.includes("timeout")) {
      errorMessage = "Recipe generation timed out. The AI model is taking too long to respond. Please try again with a simpler recipe.";
    } else if (error.message?.includes("fetch")) {
      errorMessage = "Network error while generating recipe. Please check your internet connection and try again.";
    } else if (error.status === 500 || error.message?.includes("500")) {
      errorMessage = "Server error while generating recipe. Our recipe AI is currently experiencing issues. Please try again later.";
    } else if (error.status === 400 || error.message?.includes("400")) {
      errorMessage = "Invalid request format. Please check your inputs and try again.";
    } else if (error.message?.includes("SyntaxError") || error.message?.includes("JSON")) {
      errorMessage = "Error processing the recipe. The AI generated an invalid response format. Please try again.";
    } else if (error.message?.includes("OpenAI API key")) {
      errorMessage = "There's an issue with our AI service configuration. Our team has been notified.";
    } else if (error.message?.includes("Empty request body")) {
      errorMessage = "The request couldn't be processed because it was empty. Please try again.";
    }
    
    console.error('Error in generateQuickRecipe:', error);
    throw new Error(errorMessage);
  }
};

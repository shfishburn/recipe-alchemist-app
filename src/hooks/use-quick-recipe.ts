
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Ingredient {
  // Metric measurements
  qty_metric?: number;
  unit_metric?: string;
  // Imperial measurements
  qty_imperial?: number;
  unit_imperial?: string;
  // Original measurement (backwards compatibility)
  qty?: number;
  unit?: string;
  // Common fields
  item: string | Record<string, any>;
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}

export interface QuickRecipe {
  title: string;
  tagline?: string;
  description?: string;
  ingredients: Ingredient[];
  steps?: string[];
  instructions?: string[];
  servings: number;
  prep_time_min?: number;
  cook_time_min?: number;
  prepTime?: number;
  cookTime?: number;
  nutrition?: any;
  science_notes?: string[];
  nutritionHighlight?: string;
  cookingTip?: string;
  cuisine?: string;
  dietary?: string;
  flavor_tags?: string[];
  user_id?: string;
  id?: string;
}

export interface QuickRecipeFormData {
  cuisine: string[] | string;
  dietary: string[] | string;
  mainIngredient: string;
  servings: number;
  maxCalories?: number;
}

export interface QuickRecipeOptions {
  cuisine: string;
  dietary: string;
  flavorTags: string[];
  servings: number;
  maxCalories?: number;
  recipeRequest?: string;
}

// Function to normalize recipe response from edge function
const normalizeRecipeResponse = (data: any): QuickRecipe => {
  console.log("Normalizing recipe response:", data);
  
  if (!data) {
    throw new Error("Invalid recipe data: Received empty response");
  }
  
  if (!data.title || !data.ingredients) {
    console.error("Invalid recipe data:", data);
    throw new Error("Invalid recipe data: Missing required fields");
  }
  
  // Handle different response formats
  const ingredients = data.ingredients?.map((ingredient: any) => {
    // If already in the correct format with metric/imperial units
    if (ingredient.qty_metric !== undefined || ingredient.qty_imperial !== undefined) {
      return ingredient;
    }
    
    // Otherwise normalize to our expected format
    return {
      qty: ingredient.qty,
      unit: ingredient.unit,
      // Add metric units (same as original if not specified)
      qty_metric: ingredient.qty,
      unit_metric: ingredient.unit,
      // Add imperial units (same as original if not specified)
      qty_imperial: ingredient.qty,
      unit_imperial: ingredient.unit,
      item: ingredient.item,
      notes: ingredient.notes,
      shop_size_qty: ingredient.shop_size_qty,
      shop_size_unit: ingredient.shop_size_unit
    };
  }) || [];
  
  // Normalize the recipe structure
  return {
    title: data.title,
    tagline: data.tagline || data.description,
    description: data.description,
    ingredients: ingredients,
    // Handle different property names for instructions/steps
    instructions: data.instructions || data.steps || [],
    steps: data.steps || data.instructions || [],
    servings: data.servings || 4,
    // Handle different property names for prep/cook time
    prep_time_min: data.prep_time_min || data.prepTime,
    cook_time_min: data.cook_time_min || data.cookTime,
    prepTime: data.prepTime || data.prep_time_min,
    cookTime: data.cookTime || data.cook_time_min,
    nutrition: data.nutrition,
    science_notes: data.science_notes || [],
    nutritionHighlight: data.nutritionHighlight,
    cookingTip: data.cookingTip,
    cuisine: data.cuisine,
    dietary: data.dietary,
    flavor_tags: data.flavor_tags || []
  };
};

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

// Hook to use with Quick Recipe functionality
export const useQuickRecipe = (id?: string) => {
  const fetchRecipe = async (id: string) => {
    if (!id) {
      throw new Error('Recipe ID is required');
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }

    // Transform to ensure compatibility
    const recipe: QuickRecipe = {
      title: data.title,
      tagline: data.tagline,
      // Handle potential JSON string conversion
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : 
                  (typeof data.ingredients === 'string' ? JSON.parse(data.ingredients) : []),
      instructions: Array.isArray(data.instructions) ? data.instructions :
                  (typeof data.instructions === 'string' ? JSON.parse(data.instructions) : []),
      steps: Array.isArray(data.instructions) ? data.instructions : 
             (typeof data.instructions === 'string' ? JSON.parse(data.instructions) : []), // Ensure both properties are set for compatibility
      servings: data.servings,
      prep_time_min: data.prep_time_min,
      cook_time_min: data.cook_time_min,
      nutrition: data.nutrition,
      science_notes: Array.isArray(data.science_notes) ? data.science_notes :
                    (typeof data.science_notes === 'string' ? JSON.parse(data.science_notes) : []),
      cuisine: data.cuisine,
      dietary: data.dietary,
      flavor_tags: data.flavor_tags,
      user_id: data.user_id,
      id: data.id
    };

    return recipe;
  };

  return {
    useQuery: useQuery({
      queryKey: ['quick-recipe', id],
      queryFn: () => fetchRecipe(id as string),
      enabled: !!id,
    }),
    generateQuickRecipe
  };
};

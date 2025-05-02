
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
    
    // Increase timeout for the request to prevent premature timeouts
    const TIMEOUT_DURATION = 55000; // 55 seconds timeout (increased from previous value)
    
    // Set a timeout for the request to prevent indefinite loading
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Recipe generation timed out. Please try again.")), TIMEOUT_DURATION);
    });
    
    // Ensure cuisine and dietary are properly formatted as strings
    // The edge function expects string values, not arrays
    const cuisineValue = Array.isArray(formData.cuisine) 
      ? formData.cuisine.join(', ') 
      : formData.cuisine;
    
    const dietaryValue = Array.isArray(formData.dietary) 
      ? formData.dietary.join(', ') 
      : formData.dietary;
    
    // Define the request body with properly formatted values
    const requestBody = {
      cuisine: cuisineValue,
      dietary: dietaryValue,
      mainIngredient: formData.mainIngredient,
      servings: formData.servings || 4,
      maxCalories: formData.maxCalories
    };
    
    console.log("Sending request to edge function with body:", requestBody);
    
    // Call the Supabase Edge Function to generate the recipe
    const responsePromise = supabase.functions.invoke('generate-quick-recipe', {
      body: requestBody,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Race the response against the timeout
    const { data, error } = await Promise.race([
      responsePromise, 
      timeoutPromise.then(() => { throw new Error("Recipe generation timed out. Please try again with a simpler recipe."); })
    ]);

    if (error) {
      console.error('Error generating recipe:', error);
      throw error;
    }

    if (!data) {
      console.error('No data returned from recipe generation');
      throw new Error('No recipe data returned. Please try again.');
    }
    
    // Log the raw response for debugging
    console.log('Raw recipe data received:', data);
    
    // Normalize the recipe data to ensure it matches our expected structure
    const normalizedRecipe = normalizeRecipeResponse(data);
    
    console.log('Normalized recipe:', normalizedRecipe);
    
    return normalizedRecipe;
  } catch (error: any) {
    // Add more context to the error message
    let errorMessage = error.message || "Unknown error occurred";
    
    if (error.message?.includes("timeout")) {
      errorMessage = "Recipe generation timed out. The AI model is taking too long to respond. Please try again with a simpler recipe.";
    } else if (error.message?.includes("fetch")) {
      errorMessage = "Network error while generating recipe. Please check your internet connection and try again.";
    } else if (error.status === 500) {
      errorMessage = "Server error while generating recipe. Our recipe AI is currently experiencing issues. Please try again later.";
    } else if (error.status === 400) {
      errorMessage = "Invalid request format. Please check your inputs and try again.";
    } else if (error.message?.includes("SyntaxError") || error.message?.includes("JSON")) {
      errorMessage = "Error processing the recipe. The AI generated an invalid response format. Please try again.";
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

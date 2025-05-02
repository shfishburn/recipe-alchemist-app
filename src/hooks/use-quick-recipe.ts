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
  item: string;
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
  cuisine: string[];
  dietary: string[];
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
  });
  
  // Normalize the recipe structure
  return {
    title: data.title,
    tagline: data.tagline || data.description,
    description: data.description,
    ingredients: ingredients || [],
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
    
    // Set a timeout for the request to prevent indefinite loading
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Recipe generation timed out. Please try again.")), 30000);
    });
    
    // Call the Supabase Edge Function to generate the recipe
    const responsePromise = supabase.functions.invoke('generate-quick-recipe', {
      body: {
        cuisine: formData.cuisine.join(', '),
        dietary: formData.dietary,
        mainIngredient: formData.mainIngredient,
        servings: formData.servings,
        maxCalories: formData.maxCalories
      }
    });
    
    // Race the response against the timeout
    const { data, error } = await Promise.race([
      responsePromise, 
      timeoutPromise.then(() => { throw new Error("Recipe generation timed out"); })
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
  } catch (error) {
    console.error('Error in generateQuickRecipe:', error);
    throw error;
  }
};

// Hook to fetch a recipe by ID
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
      ingredients: data.ingredients,
      instructions: data.instructions,
      steps: data.instructions, // Ensure both properties are set for compatibility
      servings: data.servings,
      prep_time_min: data.prep_time_min,
      cook_time_min: data.cook_time_min,
      nutrition: data.nutrition,
      science_notes: Array.isArray(data.science_notes) 
        ? data.science_notes 
        : [],
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

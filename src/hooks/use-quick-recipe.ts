
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Ingredient {
  // Metric measurements
  qty_metric: number;
  unit_metric: string;
  // Imperial measurements
  qty_imperial: number;
  unit_imperial: string;
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
  ingredients: Ingredient[];
  instructions: string[];
  servings: number;
  prep_time_min?: number;
  cook_time_min?: number;
  nutrition?: any;
  science_notes?: string[];
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

// Function to generate a quick recipe
export const generateQuickRecipe = async (formData: QuickRecipeFormData): Promise<QuickRecipe> => {
  try {
    // Call the Supabase Edge Function to generate the recipe
    const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
      body: {
        cuisine: formData.cuisine.join(', '),
        dietary: formData.dietary,
        mainIngredient: formData.mainIngredient,
        servings: formData.servings,
        maxCalories: formData.maxCalories
      }
    });

    if (error) {
      console.error('Error generating recipe:', error);
      throw error;
    }

    return data;
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

  return useQuery({
    queryKey: ['quick-recipe', id],
    queryFn: () => fetchRecipe(id as string),
    enabled: !!id,
  });
};

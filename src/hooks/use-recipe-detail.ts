import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, Ingredient, Nutrition, NutriScore } from '@/types/recipe';
import { standardizeNutrition } from '@/utils/recipe-utils';

/**
 * Hook to fetch a single recipe by ID or slug from Supabase
 * @param recipeIdOrSlug - The ID or slug of the recipe to fetch
 * @returns An object containing the recipe data, loading state, and error status
 */
export function useRecipeDetail(recipeIdOrSlug: string | undefined) {
  const fetchQuery = useCallback(async (): Promise<Recipe> => {
    if (!recipeIdOrSlug) {
      throw new Error('Recipe ID or slug is required');
    }
    
    // Determine if the recipeIdOrSlug is a valid UUID
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(recipeIdOrSlug);
    
    // Construct the Supabase query based on whether we have an ID or slug
    let supabaseQuery = supabase
      .from('recipes')
      .select('*')
      .is('deleted_at', null)
    
    if (isUuid) {
      supabaseQuery = supabaseQuery.eq('id', recipeIdOrSlug);
    } else {
      supabaseQuery = supabaseQuery.eq('slug', recipeIdOrSlug);
    }
    
    const { data, error } = await supabaseQuery.single();
    
    if (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Recipe not found');
    }
    
    return transformRecipeData(data);
  }, [recipeIdOrSlug]);
  
  return useQuery({
    queryKey: ['recipes', recipeIdOrSlug],
    queryFn: fetchQuery,
    retry: 2,
  });
}

// Function to transform database recipe to our Recipe type
const transformRecipeData = (data: any): Recipe => {
  // Parse the ingredients array from the JSON string or object
  let ingredients: Ingredient[] = [];
  try {
    if (data.ingredients) {
      if (typeof data.ingredients === 'string') {
        ingredients = JSON.parse(data.ingredients);
      } else if (Array.isArray(data.ingredients)) {
        ingredients = data.ingredients;
      } else if (typeof data.ingredients === 'object') {
        ingredients = Object.values(data.ingredients);
      }
    }
  } catch (e) {
    console.error("Error parsing ingredients:", e);
    ingredients = [];
  }
  
  // Parse the instructions array from the JSON string or object
  let instructions: string[] = [];
  try {
    if (data.instructions) {
      if (typeof data.instructions === 'string') {
        instructions = JSON.parse(data.instructions);
      } else if (Array.isArray(data.instructions)) {
        instructions = data.instructions;
      }
    }
  } catch (e) {
    console.error("Error parsing instructions:", e);
    instructions = [];
  }
  
  // Parse the science_notes array from the JSON string or object
  let scienceNotes: string[] = [];
  try {
    if (data.science_notes) {
      if (typeof data.science_notes === 'string') {
        scienceNotes = JSON.parse(data.science_notes);
      } else if (Array.isArray(data.science_notes)) {
        scienceNotes = data.science_notes.map(note => 
          typeof note === 'string' ? note : String(note)
        );
      }
    }
  } catch (e) {
    console.error("Error parsing science_notes:", e);
    scienceNotes = [];
  }
  
  // Standardize nutrition data
  let nutrition: Nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };
  try {
    if (data.nutrition) {
      nutrition = standardizeNutrition(data.nutrition);
    }
  } catch (e) {
    console.error("Error parsing nutrition:", e);
  }
  
  // Parse nutri_score
  let nutriScore: NutriScore | undefined;
  try {
    if (data.nutri_score) {
      nutriScore = typeof data.nutri_score === 'string'
        ? JSON.parse(data.nutri_score)
        : data.nutri_score;
    }
  } catch (e) {
    console.error("Error parsing nutri_score:", e);
  }
  
  // Return the transformed recipe
  return {
    id: data.id,
    title: data.title || '',
    tagline: data.tagline || '', // Keep tagline for backward compatibility
    description: data.description || data.tagline || '', // Use description as primary, fallback to tagline
    ingredients: ingredients,
    instructions: instructions,
    prep_time_min: data.prep_time_min,
    cook_time_min: data.cook_time_min,
    servings: data.servings || 1,
    image_url: data.image_url,
    cuisine: data.cuisine,
    cuisine_category: data.cuisine_category || 'Global',
    tags: data.tags || [],
    user_id: data.user_id,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    original_request: data.original_request || '',
    reasoning: data.reasoning || '',
    version_number: data.version_number || 1,
    previous_version_id: data.previous_version_id,
    deleted_at: data.deleted_at,
    dietary: data.dietary || '',
    flavor_tags: data.flavor_tags || [],
    nutrition,
    science_notes: scienceNotes,
    chef_notes: data.chef_notes || '',
    cooking_tip: data.cooking_tip || '',
    nutri_score: nutriScore,
    slug: data.slug
  };
};

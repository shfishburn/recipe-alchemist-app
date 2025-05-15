import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Recipe, Ingredient, Nutrition, NutriScore } from '@/types/recipe';

// Function to standardize nutrition data
function standardizeNutrition(nutrition: any): Nutrition {
  return {
    calories: nutrition?.calories || 0,
    protein: nutrition?.protein || 0,
    carbs: nutrition?.carbs || 0,
    fat: nutrition?.fat || 0,
    fiber: nutrition?.fiber || 0,
    sugar: nutrition?.sugar || 0,
    sodium: nutrition?.sodium || 0
  };
}

// Memoize recipe transformation function to avoid recreating on each render
const transformRecipes = useCallback((dbRecipes: any[]): Recipe[] => {
  return (dbRecipes || []).map((dbRecipe: any): Recipe => {
    // Parse ingredients JSON to Ingredient array
    let ingredients: Ingredient[] = [];
    try {
      ingredients = Array.isArray(dbRecipe.ingredients) 
        ? (dbRecipe.ingredients as unknown as Ingredient[])
        : typeof dbRecipe.ingredients === 'object' 
          ? (Object.values(dbRecipe.ingredients) as unknown as Ingredient[])
          : [];
    } catch (e) {
      console.error('Failed to parse ingredients', e);
    }
    
    // Parse science_notes JSON to string array
    let scienceNotes: string[] = [];
    try {
      if (dbRecipe.science_notes) {
        scienceNotes = Array.isArray(dbRecipe.science_notes) 
          ? dbRecipe.science_notes.map((note: any) => typeof note === 'string' ? note : String(note))
          : [];
      }
    } catch (e) {
      console.error('Failed to parse science notes', e);
    }
    
    // Parse nutrition JSON to Nutrition object
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
      if (dbRecipe.nutrition) {
        nutrition = standardizeNutrition(dbRecipe.nutrition);
      }
    } catch (e) {
      console.error('Failed to parse nutrition', e);
    }
    
    // Parse nutri_score JSON to NutriScore object
    let nutriScore: NutriScore | undefined;
    try {
      if (dbRecipe.nutri_score) {
        nutriScore = typeof dbRecipe.nutri_score === 'string'
          ? JSON.parse(dbRecipe.nutri_score)
          : dbRecipe.nutri_score as unknown as NutriScore;
      }
    } catch (e) {
      console.error('Failed to parse nutri_score', e);
    }
    
    // Return a complete Recipe object with default values for missing properties
    const tags = Array.isArray(dbRecipe.tags) ? dbRecipe.tags : [];
    const flavorTags = Array.isArray(dbRecipe.flavor_tags) ? dbRecipe.flavor_tags : [];
    
    return {
      id: dbRecipe.id,
      title: dbRecipe.title || '',
      ingredients: ingredients,
      instructions: dbRecipe.instructions || [],
      prep_time_min: dbRecipe.prep_time_min,
      cook_time_min: dbRecipe.cook_time_min,
      servings: dbRecipe.servings || 1,
      image_url: dbRecipe.image_url,
      cuisine: dbRecipe.cuisine,
      cuisine_category: dbRecipe.cuisine_category || "Global",
      tags: tags,
      user_id: dbRecipe.user_id,
      created_at: dbRecipe.created_at || new Date().toISOString(),
      updated_at: dbRecipe.updated_at || new Date().toISOString(),
      original_request: dbRecipe.original_request || '',
      reasoning: dbRecipe.reasoning || '',
      tagline: dbRecipe.tagline || '',
      description: dbRecipe.description || dbRecipe.tagline || '',  // Use description as primary, fallback to tagline
      version_number: dbRecipe.version_number || 1,
      previous_version_id: dbRecipe.previous_version_id,
      deleted_at: dbRecipe.deleted_at,
      dietary: dbRecipe.dietary || '',
      flavor_tags: flavorTags,
      nutrition: nutrition,
      science_notes: scienceNotes,
      chef_notes: dbRecipe.chef_notes || '',
      nutri_score: nutriScore,
      slug: dbRecipe.slug
    };
  });
}, []);

export function useRecipes() {
  const fetchQuery = useCallback(async () => {
    const supabaseQuery = supabase
      .from('recipes')
      .select('id, title, tagline, description, cuisine, dietary, cook_time_min, prep_time_min, image_url, nutrition, ingredients, science_notes')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }

    // Transform the data using the memoized transformation function
    return transformRecipes(data);
  }, [transformRecipes]);

  return useQuery(['recipes'], fetchQuery);
}

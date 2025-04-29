
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Recipe, Ingredient, Nutrition } from '@/types/recipe';
import { toast } from 'sonner';

// Database recipe type coming directly from Supabase
type DbRecipe = Database['public']['Tables']['recipes']['Row'];

export const useRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term to prevent excessive refetches
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Memoize recipe transformation function to avoid recreating on each render
  const transformRecipes = useCallback((dbRecipes: DbRecipe[]): Recipe[] => {
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
            ? (dbRecipe.science_notes as unknown as string[])
            : [];
        }
      } catch (e) {
        console.error('Failed to parse science notes', e);
      }
      
      // Parse nutrition JSON to Nutrition object
      let nutrition: Nutrition = {};
      try {
        if (dbRecipe.nutrition) {
          nutrition = dbRecipe.nutrition as unknown as Nutrition;
        }
      } catch (e) {
        console.error('Failed to parse nutrition', e);
      }
      
      // Return a complete Recipe object with default values for missing properties
      return {
        id: dbRecipe.id,
        title: dbRecipe.title || '',
        description: dbRecipe.description || '',
        ingredients: ingredients,
        instructions: dbRecipe.instructions || [],
        prep_time_min: dbRecipe.prep_time_min,
        cook_time_min: dbRecipe.cook_time_min,
        servings: dbRecipe.servings || 1,
        image_url: dbRecipe.image_url,
        cuisine: dbRecipe.cuisine,
        cuisine_category: dbRecipe.cuisine_category || "Global",
        tags: dbRecipe.tags || [],
        user_id: dbRecipe.user_id,
        created_at: dbRecipe.created_at || new Date().toISOString(),
        updated_at: dbRecipe.updated_at || new Date().toISOString(),
        original_request: dbRecipe.original_request || '',
        reasoning: dbRecipe.reasoning || '',
        tagline: dbRecipe.tagline || '',
        version_number: dbRecipe.version_number || 1,
        previous_version_id: dbRecipe.previous_version_id,
        deleted_at: dbRecipe.deleted_at,
        dietary: dbRecipe.dietary || '',
        flavor_tags: dbRecipe.flavor_tags || [],
        nutrition: nutrition,
        science_notes: scienceNotes,
        chef_notes: dbRecipe.chef_notes || '',
      };
    });
  }, []);

  const query = useQuery<Recipe[]>({
    queryKey: ['recipes', debouncedSearchTerm],
    queryFn: async () => {
      console.log('Fetching recipes with search term:', debouncedSearchTerm);
      
      try {
        // Build the base query
        let supabaseQuery = supabase
          .from('recipes')
          .select('id, title, tagline, cuisine, dietary, cook_time_min, prep_time_min, image_url, nutrition, ingredients, science_notes')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        // Apply search filter if needed
        if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
          const trimmedTerm = debouncedSearchTerm.trim();
          supabaseQuery = supabaseQuery.or(
            `title.ilike.%${trimmedTerm}%,tagline.ilike.%${trimmedTerm}%,cuisine.ilike.%${trimmedTerm}%,dietary.ilike.%${trimmedTerm}%`
          );
        }

        const { data, error } = await supabaseQuery;

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }
        
        console.log('Recipes fetched successfully:', data?.length || 0, 'recipes');
        
        // Transform the database recipes to match our Recipe type
        return transformRecipes(data || []);
      } catch (error) {
        console.error('Unexpected error fetching recipes:', error);
        toast.error('Failed to fetch recipes. Please try again.');
        throw error;
      }
    },
    retry: 1,
    staleTime: 60000, // 1 minute
    gcTime: 300000,   // 5 minutes
  });

  return {
    ...query,
    searchTerm,
    setSearchTerm,
  };
};

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

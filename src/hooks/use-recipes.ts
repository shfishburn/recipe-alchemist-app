
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import { toast } from 'sonner';
import { transformRecipeData } from '@/utils/recipe-transformers';

// Custom hook to get recipes with search functionality
export const useRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term to prevent excessive refetches
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Query to fetch and transform recipes
  const query = useQuery({
    queryKey: ['recipes', debouncedSearchTerm],
    queryFn: async (): Promise<Recipe[]> => {
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
        return (data || []).map(dbRecipe => transformRecipeData(dbRecipe));
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

  // Return the query result along with search functionality
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

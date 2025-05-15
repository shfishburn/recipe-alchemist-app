
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { transformRecipeData } from '@/utils/recipe-transformers';
import type { Recipe } from '@/types/recipe';

export interface RecipesOptions {
  limit?: number;
  searchTerm?: string;
  showDeleted?: boolean;
}

export const useRecipes = (options?: RecipesOptions) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(options?.searchTerm || '');
  const { limit = 20, showDeleted = false } = options || {};

  // Main recipes query
  const recipesQuery = useQuery({
    queryKey: ['recipes', limit, showDeleted, searchTerm],
    queryFn: async () => {
      try {
        // Start with base query
        let query = supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        // Apply soft delete filter unless showing deleted
        if (!showDeleted) {
          query = query.is('deleted_at', null);
        }

        // Apply text search if provided
        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }

        // Transform the data to match the Recipe type
        if (!data) return [];
        
        return data.map((item) => transformRecipeData(item));
      } catch (error) {
        console.error('Error in useRecipes:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        toast({
          title: 'Error',
          description: `Failed to load recipes: ${errorMessage}`,
          variant: 'destructive',
        });
        
        throw error;
      }
    },
  });

  // Featured recipes query
  const featuredRecipesQuery = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching featured recipes:', error);
          throw error;
        }

        if (!data) return [];

        return data.map((item) => transformRecipeData(item));
      } catch (error) {
        console.error('Error fetching featured recipes:', error);
        // Don't show toast for featured recipes to avoid duplicate errors
        throw error;
      }
    },
  });

  return {
    ...recipesQuery,
    searchTerm,
    setSearchTerm,
    featuredRecipes: featuredRecipesQuery.data || [],
    isFeaturedLoading: featuredRecipesQuery.isLoading,
  };
};

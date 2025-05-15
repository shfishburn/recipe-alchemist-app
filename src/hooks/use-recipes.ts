
import { useMutation, useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import { useState } from 'react';

// Function to normalize recipe data from the database
const normalizeRecipe = (recipe: any): Recipe => {
  if (!recipe) return {} as Recipe;
  
  try {
    // Ensure ingredients is properly processed as an array
    let ingredients = [];
    
    if (Array.isArray(recipe.ingredients)) {
      ingredients = recipe.ingredients;
    } else if (typeof recipe.ingredients === 'string') {
      ingredients = JSON.parse(recipe.ingredients);
    } else if (recipe.ingredients && typeof recipe.ingredients === 'object') {
      ingredients = Array.isArray(JSON.parse(JSON.stringify(recipe.ingredients)))
        ? JSON.parse(JSON.stringify(recipe.ingredients))
        : [];
    }
    
    return {
      ...recipe,
      ingredients
    } as Recipe;
  } catch (e) {
    console.error("Error normalizing recipe:", e, recipe);
    return {
      ...recipe, 
      ingredients: []
    } as Recipe;
  }
};

// Convert Recipe to database format
const convertRecipeForDb = (recipe: Omit<Recipe, 'id'> | Recipe) => {
  // Convert complex objects to JSON strings if needed
  return {
    ...recipe,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    // Add any other conversions needed for database compatibility
  };
};

export const useRecipes = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const createRecipeMutation = useMutation({
    mutationFn: async (newRecipe: Omit<Recipe, 'id'>) => {
      const recipeForDb = convertRecipeForDb(newRecipe);
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipeForDb])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  const updateRecipeMutation = useMutation({
    mutationFn: async (updatedRecipe: Recipe) => {
      const recipeForDb = convertRecipeForDb(updatedRecipe);
      const { data, error } = await supabase
        .from('recipes')
        .update(recipeForDb)
        .eq('id', updatedRecipe.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('recipes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
  
  // Use the normalized recipe function in the query
  const recipesQuery = useQuery({
    queryKey: ['recipes', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('recipes')
        .select('*')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });
        
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(normalizeRecipe);
    },
    staleTime: 60000, // 1 minute
  });

  // Also fix in the featured recipes query
  const featuredRecipesQuery = useQuery({
    queryKey: ['recipes', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return (data || []).map(normalizeRecipe);
    },
    staleTime: 60000, // 1 minute
  });

  return {
    recipes: recipesQuery.data || [],
    featuredRecipes: featuredRecipesQuery.data || [],
    data: recipesQuery.data || [],
    isLoading: recipesQuery.isLoading,
    isFetching: recipesQuery.isFetching,
    error: recipesQuery.error,
    status: recipesQuery.status,
    searchTerm,
    setSearchTerm,
    createRecipe: createRecipeMutation.mutateAsync,
    updateRecipe: updateRecipeMutation.mutateAsync,
    deleteRecipe: deleteRecipeMutation.mutateAsync,
  };
};


import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Recipe, Ingredient, Nutrition } from '@/types/recipe';
import { toast } from 'sonner';

// Database recipe type coming directly from Supabase
type DbRecipe = Database['public']['Tables']['recipes']['Row'];

export const useRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const query = useQuery<Recipe[]>({
    queryKey: ['recipes', searchTerm],
    queryFn: async () => {
      console.log('Fetching recipes with search term:', searchTerm);
      
      try {
        let supabaseQuery = supabase
          .from('recipes')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (searchTerm && searchTerm.trim() !== '') {
          const trimmedTerm = searchTerm.trim();
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
        const recipes: Recipe[] = (data || []).map((dbRecipe: DbRecipe): Recipe => {
          // Parse ingredients JSON to Ingredient array
          let ingredients: Ingredient[] = [];
          try {
            ingredients = Array.isArray(dbRecipe.ingredients) 
              ? dbRecipe.ingredients as unknown as Ingredient[]
              : typeof dbRecipe.ingredients === 'object' 
                ? Object.values(dbRecipe.ingredients) as Ingredient[]
                : [];
          } catch (e) {
            console.error('Failed to parse ingredients', e);
          }
          
          // Parse science_notes JSON to string array
          let scienceNotes: string[] = [];
          try {
            if (dbRecipe.science_notes) {
              scienceNotes = Array.isArray(dbRecipe.science_notes) 
                ? dbRecipe.science_notes as unknown as string[]
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
          
          return {
            ...dbRecipe,
            ingredients,
            science_notes: scienceNotes,
            nutrition
          };
        });
        
        return recipes;
      } catch (error) {
        console.error('Unexpected error fetching recipes:', error);
        toast.error('Failed to fetch recipes. Please try again.');
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
  });

  return {
    ...query,
    searchTerm,
    setSearchTerm,
  };
};


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Recipe, Ingredient, Nutrition } from '@/types/recipe';

export type { Recipe, Ingredient, Nutrition };

export const useRecipeDetail = (id?: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
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
      if (!data) {
        console.error('Recipe not found');
        throw new Error('Recipe not found');
      }
      
      // Transform science_notes from JSON to string array if necessary
      let scienceNotes: string[] = [];
      if (data.science_notes) {
        try {
          // Handle both string[] and other formats
          if (Array.isArray(data.science_notes)) {
            scienceNotes = data.science_notes as string[];
          } else {
            // If it's stored as JSON string or other format, try to parse it
            const parsedNotes = typeof data.science_notes === 'string' 
              ? JSON.parse(data.science_notes) 
              : data.science_notes;
            
            scienceNotes = Array.isArray(parsedNotes) ? parsedNotes : [];
          }
        } catch (e) {
          console.error('Error parsing science notes:', e);
          scienceNotes = [];
        }
      }
      
      // Type cast the JSON fields with their proper structure
      const recipe: Recipe = {
        ...data,
        ingredients: data.ingredients as unknown as Ingredient[],
        nutrition: data.nutrition as unknown as Nutrition,
        science_notes: scienceNotes
      };
      
      console.log('Recipe detail fetched:', recipe);
      return recipe;
    },
    enabled: !!id,
    retry: 1,
    staleTime: 30000,
  });
};

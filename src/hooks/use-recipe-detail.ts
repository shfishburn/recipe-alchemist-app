
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Recipe, Ingredient, Nutrition } from '@/types/recipe';
import { standardizeNutrition } from '@/types/nutrition-utils';
import { isValidUUID } from '@/utils/slug-utils';

export type { Recipe, Ingredient, Nutrition };

export const useRecipeDetail = (idOrSlug?: string) => {
  return useQuery({
    queryKey: ['recipe', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) {
        throw new Error('Recipe ID or slug is required');
      }

      // Check if we're dealing with a UUID or a slug
      const isUuid = isValidUUID(idOrSlug);
      
      try {
        let query = supabase
          .from('recipes')
          .select('*');
          
        if (isUuid) {
          // If it's a UUID, query by id
          query = query.eq('id', idOrSlug);
        } else {
          // If it's not a UUID, assume it's a slug
          query = query.eq('slug', idOrSlug);
        }
        
        const { data, error } = await query.maybeSingle();
  
        if (error) {
          console.error('Error fetching recipe:', error);
          throw error;
        }
        
        if (!data) {
          console.error('Recipe not found');
          throw new Error('Recipe not found');
        }
        
        // Transform data with better error handling
        try {
          // Transform science_notes from JSON to string array if necessary
          let scienceNotes: string[] = [];
          if (data.science_notes) {
            if (Array.isArray(data.science_notes)) {
              scienceNotes = data.science_notes as string[];
            } else {
              const parsedNotes = typeof data.science_notes === 'string' 
                ? JSON.parse(data.science_notes) 
                : data.science_notes;
              
              scienceNotes = Array.isArray(parsedNotes) ? parsedNotes : [];
            }
          }
          
          // Enhanced nutrition data processing
          let nutrition: Nutrition = {};
          if (data.nutrition) {
            const rawNutrition = typeof data.nutrition === 'string'
              ? JSON.parse(data.nutrition)
              : data.nutrition;
            
            nutrition = standardizeNutrition(rawNutrition);
          }
          
          // Type cast the JSON fields with their proper structure
          const recipe: Recipe = {
            ...data,
            ingredients: data.ingredients as unknown as Ingredient[],
            nutrition: nutrition,
            science_notes: scienceNotes
          };
          
          return recipe;
        } catch (parseError) {
          console.error('Error parsing recipe data:', parseError);
          throw new Error('Error processing recipe data');
        }
      } catch (e) {
        console.error('Error in recipe detail fetch:', e);
        throw e;
      }
    },
    enabled: !!idOrSlug,
    retry: 1,
    staleTime: 30000,
  });
};

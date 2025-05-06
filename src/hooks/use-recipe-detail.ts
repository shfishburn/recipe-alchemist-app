
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe, Ingredient, Nutrition, NutriScore } from '@/types/recipe';
import { standardizeNutrition } from '@/utils/nutrition-utils';
import { isValidUUID } from '@/utils/slug-utils';

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
          
        // Use a single query branch with conditional WHERE clause
        query = isUuid
          ? query.eq('id', idOrSlug)
          : query.eq('slug', idOrSlug);
        
        const { data, error } = await query.maybeSingle();
  
        if (error) {
          console.error('Error fetching recipe:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('Recipe not found');
        }
        
        // Transform data with better error handling
        try {
          // Process all JSON data at once
          const scienceNotes = Array.isArray(data.science_notes)
            ? data.science_notes
            : typeof data.science_notes === 'string'
              ? JSON.parse(data.science_notes)
              : [];
          
          // Use our standardizeNutrition helper
          const nutrition = standardizeNutrition(
            typeof data.nutrition === 'string'
              ? JSON.parse(data.nutrition)
              : data.nutrition
          );
          
          // Parse nutri_score to the proper type
          const nutriScore: NutriScore | undefined = data.nutri_score
            ? (typeof data.nutri_score === 'string'
                ? JSON.parse(data.nutri_score)
                : data.nutri_score as unknown as NutriScore)
            : undefined;
            
          // Build the full recipe object with proper typing
          const recipe: Recipe = {
            ...data,
            ingredients: data.ingredients as unknown as Ingredient[],
            nutrition: nutrition,
            science_notes: Array.isArray(scienceNotes) ? scienceNotes.map(note => String(note)) : [],
            nutri_score: nutriScore
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
    staleTime: 300000, // 5 minutes (increased from 30 seconds)
  });
};

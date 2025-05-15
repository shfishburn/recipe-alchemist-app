
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe, Ingredient, Nutrition, NutriScore } from '@/types/recipe';
import { standardizeNutrition } from '@/utils/nutrition-utils';
import { isValidUUID } from '@/utils/slug-utils';
import { toast } from 'sonner';
import { transformDbToRecipe } from '@/utils/db-transformers';

export type { Recipe, Ingredient, Nutrition };

export const useRecipeDetail = (idOrSlug?: string) => {
  return useQuery({
    queryKey: ['recipe', idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) {
        console.error('Recipe ID or slug is missing');
        throw new Error('Recipe ID or slug is required');
      }

      console.log(`Fetching recipe with identifier: ${idOrSlug}`);

      // Check if we're dealing with a UUID or a slug
      const isUuid = isValidUUID(idOrSlug);
      console.log(`Identifier is ${isUuid ? 'a UUID' : 'a slug'}`);
      
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
          console.error('Recipe not found:', { idOrSlug });
          throw new Error('Recipe not found');
        }
        
        console.log('Recipe raw data fetched:', {
          id: data.id,
          slug: data.slug,
          title: data.title,
          scienceNotesType: typeof data.science_notes,
          hasIngredients: !!data.ingredients,
          hasNutrition: !!data.nutrition
        });
        
        // Transform database record to Recipe type
        const recipe = transformDbToRecipe(data);
        
        console.log('Recipe transformed successfully:', {
          id: recipe.id,
          title: recipe.title,
          scienceNotesCount: recipe.science_notes.length
        });
        
        return recipe;
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

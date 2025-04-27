
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';
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

      if (error) throw error;
      if (!data) throw new Error('Recipe not found');
      
      // Type cast the JSON fields with their proper structure
      const recipe: Recipe = {
        ...data,
        ingredients: data.ingredients as unknown as Ingredient[],
        nutrition: data.nutrition as unknown as Nutrition
      };
      
      return recipe;
    },
    enabled: !!id,
  });
};

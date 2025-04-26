
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface Ingredient {
  qty: number;
  unit: string;
  item: string;
}

export interface Nutrition {
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
}

export interface Recipe extends Omit<Database['public']['Tables']['recipes']['Row'], 'ingredients' | 'nutrition'> {
  ingredients: Ingredient[];
  nutrition: Nutrition;
}

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

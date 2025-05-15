
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';

// Re-export the Recipe type for components that need it
export type { Recipe };

export const useRecipeDetail = (id?: string) => {
  const query = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching recipe:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
    retry: 2,
    staleTime: 60000,
    gcTime: 300000,
    refetchOnWindowFocus: false,
  });
  
  // Fix the recipe type conversion
  const processRecipe = (data: any): Recipe => {
    if (!data) return {} as Recipe;
    
    try {
      // Ensure ingredients is properly processed as an array
      const ingredients = Array.isArray(data.ingredients)
        ? data.ingredients
        : typeof data.ingredients === 'string' 
          ? JSON.parse(data.ingredients)
          : Array.isArray(JSON.parse(JSON.stringify(data.ingredients)))
            ? JSON.parse(JSON.stringify(data.ingredients))
            : [];
            
      return {
        ...data,
        ingredients,
      } as Recipe;
    } catch (e) {
      console.error("Error processing recipe data:", e);
      return {
        ...data,
        ingredients: []
      } as Recipe;
    }
  };

  return {
    ...query,
    data: query.data ? processRecipe(query.data) : undefined,
  };
};


import { useQuery } from '@tanstack/react-query';
import { fetchRecipe } from '@/api/fetch-quick-recipe';
import { generateQuickRecipe } from '@/api/generate-quick-recipe';
import { QuickRecipeFormData } from '@/types/quick-recipe';

// Hook to use with Quick Recipe functionality
export const useQuickRecipe = (id?: string) => {
  return {
    useQuery: useQuery({
      queryKey: ['quick-recipe', id],
      queryFn: () => fetchRecipe(id as string),
      enabled: !!id,
    }),
    generateQuickRecipe
  };
};

// Re-export the generateQuickRecipe function for backward compatibility
export { generateQuickRecipe };

// Re-export types for backward compatibility
export type { QuickRecipe, QuickRecipeFormData, QuickRecipeOptions, Ingredient } from '@/types/quick-recipe';


import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';
import { standardizeNutrition } from '@/types/nutrition-utils';

// Export the EnhancedNutrition type for components that need it
export type { EnhancedNutrition };

interface NutritionDataResult {
  recipeNutrition: EnhancedNutrition;
  isLoading: boolean;
  error: Error | null;
  refetchNutrition: () => void;
}

export function useNutritionData(recipe: Recipe): NutritionDataResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Process recipe nutrition to ensure it has all required fields
  const recipeNutrition: EnhancedNutrition = recipe.nutrition ? 
    standardizeNutrition(recipe.nutrition) as EnhancedNutrition : 
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0, 
      fiber: 0,
      sugar: 0,
      sodium: 0
    };

  // Function to refresh nutrition data if needed
  const refetchNutrition = async () => {
    setIsLoading(true);
    try {
      // Placeholder for actual fetch logic if needed in the future
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  };

  return {
    recipeNutrition,
    isLoading,
    error,
    refetchNutrition
  };
}

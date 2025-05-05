
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Recipe } from '@/types/recipe';
import { toast } from 'sonner';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';
import type { Profile } from '@/hooks/use-auth';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { NutritionPreferencesType } from '@/types/nutrition-preferences';

export interface UserNutritionPreferences {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  unitSystem?: 'metric' | 'imperial';
}

export function useNutritionData(recipe: Recipe | undefined) {
  const { unitSystem } = useUnitSystem();
  const [recipeNutrition, setRecipeNutrition] = useState<EnhancedNutrition | null>(null);
  
  // Query for enhanced nutrition data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recipe-nutrition', recipe?.id],
    queryFn: async () => {
      if (!recipe?.nutrition) {
        throw new Error('No nutrition data available');
      }
      
      // This is where we'd normally fetch enhanced data from an API
      // For now, we'll just enhance the existing data locally
      const enhancedNutrition: EnhancedNutrition = {
        ...recipe.nutrition,
        servingSize: recipe.nutrition.serving_size || 100,
        dataQuality: recipe.nutrition.data_quality || 'medium',
        calories: recipe.nutrition.calories || 0,
        protein: recipe.nutrition.protein || 0,
        carbs: recipe.nutrition.carbs || 0,
        fat: recipe.nutrition.fat || 0,
        fiber: recipe.nutrition.fiber || 0,
        sugar: recipe.nutrition.sugar || 0,
        sodium: recipe.nutrition.sodium || 0,
      };
      
      return enhancedNutrition;
    },
    enabled: !!recipe?.nutrition && Object.keys(recipe.nutrition).length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Set nutrition data when available
  useEffect(() => {
    if (data) {
      setRecipeNutrition(data);
    } else if (recipe?.nutrition) {
      // Create a basic enhanced nutrition object from recipe nutrition
      const baseNutrition: EnhancedNutrition = {
        calories: recipe.nutrition.calories || 0,
        protein: recipe.nutrition.protein || 0,
        carbs: recipe.nutrition.carbs || 0,
        fat: recipe.nutrition.fat || 0,
        fiber: recipe.nutrition.fiber || 0,
        sugar: recipe.nutrition.sugar || 0,
        sodium: recipe.nutrition.sodium || 0,
        servingSize: recipe.nutrition.serving_size || 100,
        dataQuality: recipe.nutrition.data_quality || 'medium',
      };
      setRecipeNutrition(baseNutrition);
    }
  }, [recipe, data]);
  
  // Show error toast if nutrition data fails to load
  useEffect(() => {
    if (error) {
      toast.error('Failed to load nutrition data');
      console.error('Nutrition data error:', error);
    }
  }, [error]);

  return {
    recipeNutrition,
    isLoading,
    error,
    refetchNutrition: refetch
  };
}

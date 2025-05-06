
import { useState } from 'react';
import { Recipe, Nutrition } from '@/types/recipe';
import { standardizeNutrition } from '@/utils/nutrition-utils';

// Define EnhancedNutrition type for components that need it
export interface EnhancedNutrition extends Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  saturated_fat?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  data_quality?: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
  };
  verification?: {
    verified_at: string;
    verified_nutrients: string[];
    verification_source: 'fdc_api' | 'usda_sr28';
    verification_confidence: number;
    differences?: Record<string, {old: number, new: number, difference_percent: number}>;
  };
}

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

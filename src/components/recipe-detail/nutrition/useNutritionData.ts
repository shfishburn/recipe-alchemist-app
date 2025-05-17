
import { useState, useEffect } from 'react';
import type { Recipe } from '@/types/recipe';
import { standardizeNutrition } from '@/utils/nutrition-utils';

// Enhanced nutrition includes additional micronutrients and metadata
export interface EnhancedNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  data_quality?: {
    overall_confidence: string;
    overall_confidence_score: number;
    recommended_macros?: {
      protein?: number;
      carbs?: number;
      fat?: number;
    }
  };
  [key: string]: any;
}

export function useNutritionData(recipe: Recipe) {
  const [recipeNutrition, setRecipeNutrition] = useState<EnhancedNutrition | null>(null);
  
  useEffect(() => {
    if (recipe?.nutrition) {
      // Standardize the nutrition data to ensure consistent format
      const standardized = standardizeNutrition(recipe.nutrition);
      setRecipeNutrition(standardized as EnhancedNutrition);
    } else {
      setRecipeNutrition(null);
    }
  }, [recipe]);

  return {
    recipeNutrition,
    refetchNutrition: () => {
      if (recipe?.nutrition) {
        const standardized = standardizeNutrition(recipe.nutrition);
        setRecipeNutrition(standardized as EnhancedNutrition);
      }
    }
  };
}

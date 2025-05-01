
// Import necessary types and functions
import { useEffect, useState } from 'react';
import { standardizeNutrition } from '@/types/nutrition-utils';
import { type Recipe } from '@/types/recipe';
import type { Profile } from '@/hooks/use-auth';

// This interface is for the component's internal use
export interface ExtendedNutritionData {
  calories: number;
  protein: number;
  carbs: number; // Note: we use carbs instead of carbohydrates to be consistent
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  potassium?: number;
  calcium?: number;
  vitaminA?: number;
  vitaminC?: number;
  iron?: number;
  zinc?: number;
  [key: string]: number | string | boolean | object | undefined;
}

export interface NutritionPreferences {
  unitSystem: 'metric' | 'imperial';
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Main hook to process nutrition data
export function useNutritionData(recipe: Recipe, profile?: Profile | null) {
  const [recipeNutrition, setRecipeNutrition] = useState<ExtendedNutritionData | null>(null);
  const [userPreferences, setUserPreferences] = useState<NutritionPreferences | null>(null);
  
  // Process recipe nutrition data
  useEffect(() => {
    try {
      if (!recipe?.nutrition) return;
      
      // Standardize nutrition data format
      const standardized = standardizeNutrition(recipe.nutrition);
      
      // Create an enhanced nutrition object with all available data
      const enhanced: ExtendedNutritionData = {
        calories: Number(standardized.calories) || 0,
        protein: Number(standardized.protein) || 0,
        carbs: Number(standardized.carbs) || 0, // Using carbs consistently
        fat: Number(standardized.fat) || 0,
        fiber: Number(standardized.fiber) || undefined,
        sugar: Number(standardized.sugar) || undefined,
        sodium: Number(standardized.sodium) || undefined,
        cholesterol: Number(standardized.cholesterol) || undefined,
      };
      
      // Add any additional properties from the standardized data
      Object.entries(standardized).forEach(([key, value]) => {
        if (key !== 'calories' && key !== 'protein' && key !== 'carbs' && key !== 'fat' && 
            key !== 'fiber' && key !== 'sugar' && key !== 'sodium' && key !== 'cholesterol') {
          enhanced[key] = value;
        }
      });
      
      setRecipeNutrition(enhanced);
    } catch (error) {
      console.error("Error processing nutrition data:", error);
      setRecipeNutrition(null);
    }
  }, [recipe]);
  
  // Process user preferences from profile
  useEffect(() => {
    if (profile?.nutrition_preferences) {
      try {
        const { macroSplit, dailyCalories } = profile.nutrition_preferences;
        
        setUserPreferences({
          unitSystem: 'metric', // Default to metric, will be overridden by context
          dailyCalories: Number(dailyCalories) || 2000,
          macroSplit: {
            protein: Number(macroSplit?.protein) || 30,
            carbs: Number(macroSplit?.carbs) || 40,
            fat: Number(macroSplit?.fat) || 30,
          }
        });
      } catch (error) {
        console.error("Error processing user preferences:", error);
        setUserPreferences(null);
      }
    }
  }, [profile]);
  
  return { recipeNutrition, userPreferences };
}

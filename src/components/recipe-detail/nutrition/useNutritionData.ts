
import { useState, useEffect } from 'react';
import { standardizeNutrition } from '@/types/nutrition-utils';
import type { Recipe } from '@/types/recipe';
import type { Profile } from '@/hooks/use-auth';
import { useUnitSystem } from '@/hooks/use-unit-system';
import { isNutritionPreferences } from '@/types/nutrition';

export interface UserNutritionPreferences {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  unitSystem?: 'metric' | 'imperial';
}

export interface ExtendedNutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
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
  // Add any other properties you need
}

export function useNutritionData(recipe: Recipe, profile?: Profile | null) {
  const [recipeNutrition, setRecipeNutrition] = useState<ExtendedNutritionData | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserNutritionPreferences | null>(null);
  const { unitSystem } = useUnitSystem();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Process recipe nutrition
    if (recipe?.nutrition) {
      try {
        const standardized = standardizeNutrition(recipe.nutrition);
        setRecipeNutrition({
          calories: standardized.calories || 0,
          protein: standardized.protein || 0,
          carbs: standardized.carbs || 0,
          fat: standardized.fat || 0,
          fiber: standardized.fiber || 0,
          sugar: standardized.sugar || 0,
          sodium: standardized.sodium || 0,
          vitaminA: standardized.vitamin_a || 0,
          vitaminC: standardized.vitamin_c || 0,
          vitaminD: standardized.vitamin_d || 0,
          calcium: standardized.calcium || 0,
          iron: standardized.iron || 0,
          potassium: standardized.potassium || 0,
          data_quality: standardized.data_quality
        });
      } catch (error) {
        console.error('Error processing nutrition data:', error);
        setRecipeNutrition(null);
      }
    } else {
      setRecipeNutrition(null);
    }

    // Process user preferences
    if (profile) {
      let dailyCalories = 2000;
      let macroSplit = {
        protein: 30,
        carbs: 40,
        fat: 30,
      };

      // Try to get nutrition preferences from the profile
      if (profile.nutrition_preferences) {
        try {
          // Check if nutrition_preferences is properly structured
          if (isNutritionPreferences(profile.nutrition_preferences)) {
            const nutritionPrefs = profile.nutrition_preferences;
            
            // Extract values from nutrition preferences
            dailyCalories = nutritionPrefs.dailyCalories || 2000;
            macroSplit = {
              protein: nutritionPrefs.macroSplit?.protein || 30,
              carbs: nutritionPrefs.macroSplit?.carbs || 40,
              fat: nutritionPrefs.macroSplit?.fat || 30,
            };
          }
        } catch (error) {
          console.error('Error processing nutrition preferences:', error);
        }
      }

      setUserPreferences({
        dailyCalories,
        macroSplit,
        unitSystem
      });
    } else {
      // Default preferences
      setUserPreferences({
        dailyCalories: 2000,
        macroSplit: {
          protein: 30,
          carbs: 40,
          fat: 30
        },
        unitSystem
      });
    }
  }, [recipe, profile, unitSystem, version]);

  const refetchNutrition = () => {
    setVersion(prev => prev + 1);
  };

  return { recipeNutrition, userPreferences, refetchNutrition };
}

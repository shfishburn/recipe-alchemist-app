
import { useState, useEffect } from 'react';
import { standardizeNutrition } from '@/types/nutrition-utils';
import type { Recipe, Nutrition } from '@/types/recipe';
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

export interface ExtendedNutritionData extends Nutrition {
  // Any additional properties specific to the extended data
}

// Validate nutrition data to ensure reasonable values
function validateNutritionValues(nutrition: any): ExtendedNutritionData {
  // Create a copy to avoid mutating the original
  const validated: ExtendedNutritionData = {
    calories: Math.min(Math.abs(nutrition.calories || 0), 5000),  // Max 5000 calories
    protein: Math.min(Math.abs(nutrition.protein || 0), 300),     // Max 300g protein
    carbs: Math.min(Math.abs(nutrition.carbs || 0), 500),         // Max 500g carbs
    fat: Math.min(Math.abs(nutrition.fat || 0), 300),             // Max 300g fat
    fiber: Math.min(Math.abs(nutrition.fiber || 0), 100),         // Max 100g fiber
    sugar: Math.min(Math.abs(nutrition.sugar || 0), 100),         // Max 100g sugar
    sodium: Math.min(Math.abs(nutrition.sodium || 0), 5000)       // Max 5000mg sodium
  };

  // Handle micronutrients with reasonable caps
  if (nutrition.vitaminA !== undefined) validated.vitaminA = Math.min(Math.abs(nutrition.vitaminA), 10000);
  if (nutrition.vitaminC !== undefined) validated.vitaminC = Math.min(Math.abs(nutrition.vitaminC), 1000);
  if (nutrition.vitaminD !== undefined) validated.vitaminD = Math.min(Math.abs(nutrition.vitaminD), 1000);
  if (nutrition.calcium !== undefined) validated.calcium = Math.min(Math.abs(nutrition.calcium), 2000);
  if (nutrition.iron !== undefined) validated.iron = Math.min(Math.abs(nutrition.iron), 100);
  if (nutrition.potassium !== undefined) validated.potassium = Math.min(Math.abs(nutrition.potassium), 10000);
  
  // Include aliases for compatibility
  validated.kcal = validated.calories;
  validated.protein_g = validated.protein;
  validated.carbs_g = validated.carbs;
  validated.fat_g = validated.fat;
  validated.fiber_g = validated.fiber;
  validated.sugar_g = validated.sugar;
  validated.sodium_mg = validated.sodium;

  // Include data quality info if present
  if (nutrition.data_quality) {
    validated.data_quality = nutrition.data_quality;
  }

  // Include per-ingredient data if available
  if (nutrition.per_ingredient) {
    validated.per_ingredient = nutrition.per_ingredient;
  }

  return validated;
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
        
        // Apply validation to ensure reasonable values
        const validated = validateNutritionValues(standardized);
        
        // Log if we found unreasonable values
        if (standardized.calories > 5000 || standardized.fat > 300) {
          console.warn('Recipe has unusually high nutrition values, applying caps:', {
            originalCalories: standardized.calories,
            originalFat: standardized.fat,
            cappedCalories: validated.calories,
            cappedFat: validated.fat
          });
        }
        
        setRecipeNutrition(validated);
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

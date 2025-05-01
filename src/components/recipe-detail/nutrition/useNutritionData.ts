
import React from 'react';
import { Recipe } from '@/types/recipe';
import { Profile } from '@/hooks/use-auth';
import { standardizeNutrition, DAILY_REFERENCE_VALUES, getDailyValuePercentage } from '@/types/nutrition-utils';

export interface ExtendedNutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  calcium: number;
  iron: number;
  potassium: number;
  // Percentages of daily values
  caloriesPercentage: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
  fiberPercentage: number;
  sugarPercentage: number;
  sodiumPercentage: number;
  vitamin_a_percentage: number;
  vitamin_c_percentage: number;
  vitamin_d_percentage: number;
  calcium_percentage: number;
  iron_percentage: number;
  potassium_percentage: number;
  // Optional enhanced data
  data_quality?: any;
  per_ingredient?: any;
  audit_log?: any;
}

export function useNutritionData(recipe: Recipe, profile: Profile | null) {
  // Standardize nutrition data from the recipe using common naming conventions
  const recipeNutrition = React.useMemo(() => {
    if (!recipe.nutrition) {
      console.log("Recipe has no nutrition data");
      return null;
    }
    
    let nutritionData: any = recipe.nutrition;
    // If it's a string, try to parse it
    if (typeof nutritionData === 'string') {
      try {
        nutritionData = JSON.parse(nutritionData);
      } catch (e) {
        console.error("Error parsing nutrition data string:", e);
        return null;
      }
    }
    
    // Apply standardization to ensure consistent property access
    const standardizedNutrition = standardizeNutrition(nutritionData);
    
    console.log("Standardized nutrition:", standardizedNutrition);
    
    // Extract values with better fallback handling
    const enhancedData: ExtendedNutritionData = {
      calories: standardizedNutrition.calories || standardizedNutrition.kcal || 0,
      protein: standardizedNutrition.protein || standardizedNutrition.protein_g || 0,
      carbs: standardizedNutrition.carbs || standardizedNutrition.carbohydrates || 0,
      fat: standardizedNutrition.fat || standardizedNutrition.fat_g || 0,
      fiber: standardizedNutrition.fiber || standardizedNutrition.fiber_g || 0,
      sugar: standardizedNutrition.sugar || standardizedNutrition.sugar_g || 0,
      sodium: standardizedNutrition.sodium || standardizedNutrition.sodium_mg || 0,
      vitamin_a: standardizedNutrition.vitamin_a || standardizedNutrition.vitaminA || standardizedNutrition.vitamin_a_iu || 0,
      vitamin_c: standardizedNutrition.vitamin_c || standardizedNutrition.vitaminC || standardizedNutrition.vitamin_c_mg || 0,
      vitamin_d: standardizedNutrition.vitamin_d || standardizedNutrition.vitaminD || standardizedNutrition.vitamin_d_iu || 0,
      calcium: standardizedNutrition.calcium || standardizedNutrition.calcium_mg || 0,
      iron: standardizedNutrition.iron || standardizedNutrition.iron_mg || 0,
      potassium: standardizedNutrition.potassium || standardizedNutrition.potassium_mg || 0,
      // Calculate percentages of daily values
      caloriesPercentage: getDailyValuePercentage('calories', standardizedNutrition.calories || standardizedNutrition.kcal || 0),
      proteinPercentage: getDailyValuePercentage('protein', standardizedNutrition.protein || standardizedNutrition.protein_g || 0),
      carbsPercentage: getDailyValuePercentage('carbohydrates', standardizedNutrition.carbs || standardizedNutrition.carbohydrates || 0),
      fatPercentage: getDailyValuePercentage('fat', standardizedNutrition.fat || standardizedNutrition.fat_g || 0),
      fiberPercentage: getDailyValuePercentage('fiber', standardizedNutrition.fiber || standardizedNutrition.fiber_g || 0),
      sugarPercentage: getDailyValuePercentage('sugar', standardizedNutrition.sugar || standardizedNutrition.sugar_g || 0),
      sodiumPercentage: getDailyValuePercentage('sodium', standardizedNutrition.sodium || standardizedNutrition.sodium_mg || 0),
      vitamin_a_percentage: getDailyValuePercentage('vitamin_a', standardizedNutrition.vitamin_a || standardizedNutrition.vitaminA || standardizedNutrition.vitamin_a_iu || 0),
      vitamin_c_percentage: getDailyValuePercentage('vitamin_c', standardizedNutrition.vitamin_c || standardizedNutrition.vitaminC || standardizedNutrition.vitamin_c_mg || 0),
      vitamin_d_percentage: getDailyValuePercentage('vitamin_d', standardizedNutrition.vitamin_d || standardizedNutrition.vitaminD || standardizedNutrition.vitamin_d_iu || 0),
      calcium_percentage: getDailyValuePercentage('calcium', standardizedNutrition.calcium || standardizedNutrition.calcium_mg || 0),
      iron_percentage: getDailyValuePercentage('iron', standardizedNutrition.iron || standardizedNutrition.iron_mg || 0),
      potassium_percentage: getDailyValuePercentage('potassium', standardizedNutrition.potassium || standardizedNutrition.potassium_mg || 0),
    };
    
    // Also include any enhanced nutrition data if available
    if (standardizedNutrition.data_quality) {
      enhancedData.data_quality = standardizedNutrition.data_quality;
    }
    
    if (standardizedNutrition.per_ingredient) {
      enhancedData.per_ingredient = standardizedNutrition.per_ingredient;
    }
    
    if (standardizedNutrition.audit_log) {
      enhancedData.audit_log = standardizedNutrition.audit_log;
    }
    
    return enhancedData;
  }, [recipe.nutrition]);

  // Get user preferences if available and properly formatted
  const userPreferences = React.useMemo(() => {
    if (!profile?.nutrition_preferences) return undefined;
    
    return {
      dailyCalories: profile.nutrition_preferences.dailyCalories || 2000, // sensible default
      macroSplit: {
        protein: profile.nutrition_preferences.macroSplit?.protein || 20, // sensible defaults based on 
        carbs: profile.nutrition_preferences.macroSplit?.carbs || 50,     // general dietary guidelines
        fat: profile.nutrition_preferences.macroSplit?.fat || 30
      },
      unitSystem: profile.nutrition_preferences.unitSystem || 'metric' as const
    };
  }, [profile]);

  return {
    recipeNutrition,
    userPreferences
  };
}

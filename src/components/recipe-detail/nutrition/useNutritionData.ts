
import { Recipe } from '@/types/recipe';
import { Profile } from '@/hooks/use-auth';
import { standardizeNutrition } from '@/types/nutrition-utils';

export function useNutritionData(recipe: Recipe, profile: Profile | null) {
  // Standardize nutrition data from the recipe using common naming conventions
  const recipeNutrition = React.useMemo(() => {
    if (!recipe.nutrition) return null;
    
    // Apply standardization to ensure consistent property access
    const standardizedNutrition = standardizeNutrition(recipe.nutrition);
    
    // Extract values with fallbacks for different property naming conventions
    return {
      calories: standardizedNutrition.calories || standardizedNutrition.kcal || 0,
      protein: standardizedNutrition.protein || standardizedNutrition.protein_g || 0,
      carbs: standardizedNutrition.carbs || standardizedNutrition.carbs_g || 0,
      fat: standardizedNutrition.fat || standardizedNutrition.fat_g || 0,
      fiber: standardizedNutrition.fiber_g || 0,
      sugar: standardizedNutrition.sugar_g || 0,
      sodium: standardizedNutrition.sodium_mg || 0
    };
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
      }
    };
  }, [profile]);

  return {
    recipeNutrition,
    userPreferences
  };
}

// Add React import at the top
import React from 'react';

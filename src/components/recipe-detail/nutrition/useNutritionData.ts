
import { Recipe } from '@/types/recipe';
import { Profile } from '@/hooks/use-auth';

export function useNutritionData(recipe: Recipe, profile: Profile | null) {
  // Map nutrition from the recipe
  const recipeNutrition = recipe.nutrition ? {
    calories: recipe.nutrition.calories || recipe.nutrition.kcal || 0,
    protein: recipe.nutrition.protein || recipe.nutrition.protein_g || 0,
    carbs: recipe.nutrition.carbs || recipe.nutrition.carbs_g || 0,
    fat: recipe.nutrition.fat || recipe.nutrition.fat_g || 0
  } : null;

  // Get user preferences if available and properly formatted
  const userPreferences = profile?.nutrition_preferences ? {
    dailyCalories: profile.nutrition_preferences.dailyCalories,
    macroSplit: profile.nutrition_preferences.macroSplit
  } : undefined;

  return {
    recipeNutrition,
    userPreferences
  };
}

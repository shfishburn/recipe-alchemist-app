
import { useContext } from 'react';
import { useProfileContext, ProfileContext } from '@/contexts/ProfileContext';
import { NutritionPreferencesType } from '@/types/nutrition';

export { useProfileContext } from '@/contexts/ProfileContext';

// Create a hook specifically for profile settings
export function useProfileSettings() {
  const context = useProfileContext();
  
  const nutritionPreferences = context.profile?.nutrition_preferences || {
    dailyCalories: 2000,
    macroSplit: {
      protein: 30,
      carbs: 40,
      fat: 30
    },
    dietaryRestrictions: [],
    allergens: [],
    healthGoal: 'maintenance',
    mealSizePreference: 'medium',
  };
  
  return {
    profile: context.profile,
    isLoading: context.isLoading,
    error: context.error,
    nutritionPreferences,
    saveNutritionPreferences: (preferences: NutritionPreferencesType) => {
      return context.updateProfile({
        nutrition_preferences: preferences
      });
    },
  };
}

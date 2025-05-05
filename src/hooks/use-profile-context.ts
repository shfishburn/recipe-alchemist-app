
import { useContext } from 'react';
import { ProfileContext } from '@/contexts/ProfileContext';
import { NutritionPreferencesType } from '@/types/nutrition-preferences';

// Import useProfileContext directly from the context file
import { useProfileContext } from '@/contexts/ProfileContext';

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
    preferredCuisines: [],
    unitSystem: 'metric',
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

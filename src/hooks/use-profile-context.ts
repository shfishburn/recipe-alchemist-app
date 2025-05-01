
import { useContext } from 'react';
import { useProfileContext, ProfileContext } from '@/contexts/ProfileContext';
import { NutritionPreferencesType } from '@/types/nutrition-preferences';

export { useProfileContext } from '@/contexts/ProfileContext';

// Create a hook specifically for profile settings
export function useProfileSettings() {
  const context = useProfileContext();
  
  return {
    profile: context.profile,
    isLoading: context.isLoading,
    error: context.error,
    nutritionPreferences: context.nutritionPreferences,
    saveNutritionPreferences: context.saveNutritionPreferences,
  };
}

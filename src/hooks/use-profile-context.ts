
import { useContext } from 'react';
import { ProfileContext, Profile } from '@/contexts/ProfileContext';
import { NutritionPreferencesType } from '@/types/nutrition-preferences';

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

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

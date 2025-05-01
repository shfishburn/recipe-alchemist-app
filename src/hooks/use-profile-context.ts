
import { useProfile } from '@/contexts/ProfileContext';
import { useState, useCallback } from 'react';
import type { NutritionPreferencesType } from '@/types/nutrition';

export function useProfileSettings() {
  const { profile, isLoading, isSaving, updateProfile } = useProfile();
  const [localChanges, setLocalChanges] = useState<Record<string, any>>({});
  
  // Get nutrition preferences with defaults
  const nutritionPreferences = profile?.nutrition_preferences || {
    dailyCalories: 2000,
    macroSplit: {
      protein: 30,
      carbs: 40,
      fat: 30,
    },
    dietaryRestrictions: [],
    allergens: [],
    healthGoal: 'maintenance',
    mealSizePreference: 'medium',
    unitSystem: 'metric',
  };
  
  // Handle nutrition preferences updates
  const saveNutritionPreferences = useCallback(async (
    prefs: Partial<NutritionPreferencesType> | NutritionPreferencesType
  ) => {
    const updatedPreferences = {
      ...nutritionPreferences,
      ...prefs
    };
    
    const success = await updateProfile({
      nutrition_preferences: updatedPreferences
    });
    
    return success;
  }, [nutritionPreferences, updateProfile]);
  
  // Track form changes before submission
  const trackChange = useCallback((field: string, value: any) => {
    setLocalChanges(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // Discard local changes
  const discardChanges = useCallback(() => {
    setLocalChanges({});
  }, []);
  
  // Check if form has unsaved changes
  const hasUnsavedChanges = Object.keys(localChanges).length > 0;
  
  return {
    profile,
    nutritionPreferences,
    isLoading,
    isSaving,
    saveNutritionPreferences,
    trackChange,
    discardChanges,
    hasUnsavedChanges,
    localChanges
  };
}

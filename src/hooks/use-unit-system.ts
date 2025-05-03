
import { useEffect, useCallback } from 'react';
import { useUnitSystemStore } from '@/stores/unitSystem';
import { UnitSystem } from '@/stores/unitSystem';
import { useAuth } from '@/hooks/use-auth';
import { useProfileContext } from '@/contexts/ProfileContext';
import { NutritionPreferencesType, DEFAULT_NUTRITION_PREFERENCES } from '@/types/nutrition-preferences';

/**
 * Hook for accessing and managing the unit system with profile synchronization
 * This properly handles synchronizing unit system preferences with user profile
 */
export const useUnitSystem = () => {
  const { unitSystem, setUnitSystem, toggleUnitSystem: storeToggle } = useUnitSystemStore();
  const { user } = useAuth();
  const { profile, updateProfile } = useProfileContext();
  
  // Sync with profile preference when component mounts or profile changes
  useEffect(() => {
    // Only run this effect if we have a profile with nutrition preferences
    if (profile?.nutrition_preferences?.unitSystem) {
      // Only update if different from current value to avoid loops
      if (profile.nutrition_preferences.unitSystem !== unitSystem) {
        // Update store from profile
        setUnitSystem(profile.nutrition_preferences.unitSystem);
      }
    }
  }, [profile?.nutrition_preferences?.unitSystem, setUnitSystem, unitSystem]);
  
  // Function to update unit system and sync with profile
  const updateUnitSystemWithProfile = useCallback(
    async (newSystem: UnitSystem) => {
      // Always update local state immediately for responsive UI
      setUnitSystem(newSystem);
      
      // If logged in, update profile preference in background
      if (user?.id && profile) {
        try {
          // Get current preferences
          const currentPrefs = profile.nutrition_preferences || DEFAULT_NUTRITION_PREFERENCES;
          // Merge with new unit system preference
          const updatedPrefs: NutritionPreferencesType = {
            ...currentPrefs,
            unitSystem: newSystem
          };
          
          await updateProfile({
            nutrition_preferences: updatedPrefs
          });
        } catch (error) {
          console.error('Error updating profile unit system preference:', error);
        }
      }
    },
    [user?.id, profile, updateProfile, setUnitSystem]
  );
  
  // Enhanced toggle that updates user profile when logged in
  const toggleWithProfileUpdate = useCallback(() => {
    const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    updateUnitSystemWithProfile(newSystem);
  }, [unitSystem, updateUnitSystemWithProfile]);
  
  return {
    unitSystem,
    setUnitSystem: updateUnitSystemWithProfile,
    updateUnitSystem: updateUnitSystemWithProfile, // Add this alias for compatibility
    toggleUnitSystem: toggleWithProfileUpdate,
    isMetric: unitSystem === 'metric',
    isImperial: unitSystem === 'imperial',
  };
};


import { useEffect } from 'react';
import { useUnitSystemStore } from '@/stores/unitSystem';
import { UnitSystem } from '@/stores/unitSystem';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

export const useUnitSystem = () => {
  const { unitSystem, setUnitSystem, toggleUnitSystem } = useUnitSystemStore();
  const { user, profile } = useAuth();
  
  // Sync with profile preference when component mounts or profile/user changes
  useEffect(() => {
    if (profile && profile.nutrition_preferences?.unitSystem) {
      // Only update if different from current value to avoid loops
      if (profile.nutrition_preferences.unitSystem !== unitSystem) {
        setUnitSystem(profile.nutrition_preferences.unitSystem);
      }
    }
  }, [profile, setUnitSystem, unitSystem]);
  
  // Enhanced toggle that updates user profile when logged in
  const toggleWithProfileUpdate = async () => {
    const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    toggleUnitSystem(); // Update local state immediately
    
    // If logged in, also update profile preference
    if (user?.id) {
      try {
        // Get current nutrition preferences
        const currentPrefs = profile?.nutrition_preferences || {};
        
        // Update nutrition preferences with new unit system
        await supabase
          .from('profiles')
          .update({
            nutrition_preferences: {
              ...currentPrefs,
              unitSystem: newSystem
            }
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating profile unit system preference:', error);
      }
    }
  };
  
  return {
    unitSystem,
    setUnitSystem,
    updateUnitSystem: setUnitSystem, // Add this alias for compatibility
    toggleUnitSystem: toggleWithProfileUpdate,
    isMetric: unitSystem === 'metric',
    isImperial: unitSystem === 'imperial',
  };
};

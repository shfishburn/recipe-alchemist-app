
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useUnitSystemStore } from '@/stores/unitSystem';
import { NutritionPreferencesType } from '@/types/nutrition';

export function useUnitSystem() {
  const { user } = useAuth();
  const { unitSystem, setUnitSystem } = useUnitSystemStore();
  const [isLoading, setIsLoading] = useState(true);

  // Sync with user preferences in database
  useEffect(() => {
    async function fetchUserPreferences() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('nutrition_preferences')
          .eq('id', user.id)
          .single();

        if (!error && data?.nutrition_preferences) {
          const prefs = data.nutrition_preferences as unknown as NutritionPreferencesType;
          if (prefs.unitSystem) {
            // Update the store with the user's preference
            setUnitSystem(prefs.unitSystem);
          }
        }
      } catch (error) {
        console.error('Error fetching unit system preference:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserPreferences();
  }, [user?.id, setUnitSystem]);

  const updateUnitSystem = async (newUnitSystem: 'metric' | 'imperial') => {
    if (!user?.id) return;

    try {
      // First get current preferences
      const { data: currentData } = await supabase
        .from('profiles')
        .select('nutrition_preferences')
        .eq('id', user.id)
        .single();

      const currentPrefs = (currentData?.nutrition_preferences as unknown as NutritionPreferencesType) || {};
      
      // Update with new unit system
      const updatedPrefs = {
        ...currentPrefs,
        unitSystem: newUnitSystem
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          nutrition_preferences: updatedPrefs
        })
        .eq('id', user.id);

      if (!error) {
        // Update local store
        setUnitSystem(newUnitSystem);
      } else {
        console.error('Error updating unit system:', error);
      }
    } catch (error) {
      console.error('Error updating unit system:', error);
    }
  };

  // Expose the toggleUnitSystem method from the store along with other methods
  const toggleUnitSystem = () => {
    const newSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    updateUnitSystem(newSystem);
  };

  return {
    unitSystem,
    updateUnitSystem,
    toggleUnitSystem,
    isLoading
  };
}


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { NutritionPreferencesType } from '@/types/nutrition';

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  website?: string;
  nutrition_preferences?: NutritionPreferencesType;
  weight_goal_type?: string;
  weight_goal_deficit?: number;
  [key: string]: any;
}

export function useUnitSystem() {
  const { user } = useAuth();
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [isLoading, setIsLoading] = useState(true);

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
  }, [user?.id]);

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
        setUnitSystem(newUnitSystem);
      } else {
        console.error('Error updating unit system:', error);
      }
    } catch (error) {
      console.error('Error updating unit system:', error);
    }
  };

  return {
    unitSystem,
    updateUnitSystem,
    isLoading
  };
}


import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NutritionPreferencesType {
  allergens: string[];
  healthGoal: string;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dailyCalories: number;
  weightGoalType: string;
  weightGoalDeficit: number;
  mealSizePreference: string;
  dietaryRestrictions: string[];
  unitSystem?: 'metric' | 'imperial';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  nonExerciseActivity?: 'minimal' | 'low' | 'moderate' | 'high' | 'very_high';
  exerciseIntensity?: 'light' | 'moderate' | 'challenging' | 'intense' | 'extreme';
}

// Default values
export const defaultNutritionPreferences: NutritionPreferencesType = {
  allergens: [],
  healthGoal: 'maintenance',
  macroSplit: {
    protein: 30,
    carbs: 40,
    fat: 30
  },
  dailyCalories: 2000,
  weightGoalType: 'maintenance',
  weightGoalDeficit: 0,
  mealSizePreference: 'medium',
  dietaryRestrictions: [],
  unitSystem: 'metric',
  activityLevel: 'moderate',
  nonExerciseActivity: 'moderate',
  exerciseIntensity: 'moderate'
};

// Use profile settings hook
export function useProfileSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [nutritionPreferences, setNutritionPreferences] = useState<NutritionPreferencesType>(defaultNutritionPreferences);

  // Load profile settings when profile changes
  useEffect(() => {
    if (profile && profile.nutrition_preferences) {
      setNutritionPreferences({
        ...defaultNutritionPreferences,
        ...profile.nutrition_preferences
      });
    }
  }, [profile]);

  // Save nutrition preferences
  const saveNutritionPreferences = useCallback(async (updatedPreferences: NutritionPreferencesType) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          nutrition_preferences: updatedPreferences
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setNutritionPreferences(updatedPreferences);
      
      // Refresh profile to get updated data
      await refreshProfile();
      
      toast({
        title: "Preferences saved",
        description: "Your nutrition preferences have been updated."
      });
      
      return true;
    } catch (error) {
      console.error("Error saving nutrition preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save nutrition preferences.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, refreshProfile, toast]);

  return {
    nutritionPreferences,
    setNutritionPreferences,
    saveNutritionPreferences,
    isLoading,
    isSaving
  };
}

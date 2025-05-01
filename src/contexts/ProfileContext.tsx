
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { NutritionPreferencesType, DEFAULT_NUTRITION_PREFERENCES } from '@/types/nutrition-preferences';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

// Define the Profile type with proper typing
export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  nutrition_preferences: NutritionPreferencesType;
  weight_goal_type: string;
  weight_goal_deficit: number;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  saveNutritionPreferences: (preferences: NutritionPreferencesType) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  nutritionPreferences: NutritionPreferencesType;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Extract nutrition preferences with fallbacks to defaults
  const nutritionPreferences: NutritionPreferencesType = {
    dailyCalories: profile?.nutrition_preferences?.dailyCalories || DEFAULT_NUTRITION_PREFERENCES.dailyCalories,
    macroSplit: {
      protein: profile?.nutrition_preferences?.macroSplit?.protein || DEFAULT_NUTRITION_PREFERENCES.macroSplit.protein,
      carbs: profile?.nutrition_preferences?.macroSplit?.carbs || DEFAULT_NUTRITION_PREFERENCES.macroSplit.carbs,
      fat: profile?.nutrition_preferences?.macroSplit?.fat || DEFAULT_NUTRITION_PREFERENCES.macroSplit.fat,
    },
    dietaryRestrictions: profile?.nutrition_preferences?.dietaryRestrictions || DEFAULT_NUTRITION_PREFERENCES.dietaryRestrictions,
    allergens: profile?.nutrition_preferences?.allergens || DEFAULT_NUTRITION_PREFERENCES.allergens,
    preferredCuisines: profile?.nutrition_preferences?.preferredCuisines || DEFAULT_NUTRITION_PREFERENCES.preferredCuisines,
    unitSystem: profile?.nutrition_preferences?.unitSystem || DEFAULT_NUTRITION_PREFERENCES.unitSystem
  };

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Parse JSON nutrition preferences if needed
      const parsedData: Profile = {
        ...data,
        nutrition_preferences: data.nutrition_preferences ? 
          (typeof data.nutrition_preferences === 'string' ? 
            JSON.parse(data.nutrition_preferences) : 
            data.nutrition_preferences) : 
          DEFAULT_NUTRITION_PREFERENCES
      };
      
      setProfile(parsedData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (updateData: Partial<Profile>): Promise<boolean> => {
    if (!user?.id || !profile) return false;
    
    try {
      setIsLoading(true);
      
      // Convert nutrition_preferences to a format that Supabase can store
      const dataToUpdate: Record<string, any> = { ...updateData };
      if (updateData.nutrition_preferences) {
        dataToUpdate.nutrition_preferences = updateData.nutrition_preferences as unknown as Json;
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state with new data
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const saveNutritionPreferences = async (preferences: NutritionPreferencesType): Promise<boolean> => {
    try {
      return await updateProfile({ 
        nutrition_preferences: preferences 
      });
    } catch (err) {
      console.error('Error saving nutrition preferences:', err);
      return false;
    }
  };
  
  const refreshProfile = async () => {
    await fetchProfile();
  };
  
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user?.id]);
  
  return (
    <ProfileContext.Provider value={{ 
      profile, 
      isLoading, 
      error,
      updateProfile,
      saveNutritionPreferences,
      refreshProfile,
      nutritionPreferences
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

// Export the useProfileContext hook
export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

// Create a hook specifically for profile settings
export function useProfile() {
  return useProfileContext();
}

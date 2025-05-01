
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { NutritionPreferencesType } from '@/types/nutrition';

// Profile type definition
export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  nutrition_preferences?: NutritionPreferencesType;
  weight_goal_type?: string;
  weight_goal_deficit?: number;
  created_at?: string;
}

export type ProfileUpdateData = Partial<Omit<Profile, 'id' | 'created_at'>>;

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  resetError: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      
      toast({
        title: 'Error Loading Profile',
        description: 'We couldn\'t load your profile data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);
  
  const updateProfile = useCallback(async (updateData: ProfileUpdateData): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setIsSaving(true);
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state with new data
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'An error occurred when saving your changes.',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, toast]);
  
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);
  
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  // Fetch profile data when user changes or component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  return (
    <ProfileContext.Provider value={{ 
      profile, 
      isLoading, 
      isSaving,
      error,
      updateProfile,
      refreshProfile,
      resetError
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

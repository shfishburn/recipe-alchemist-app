
import { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  nutrition_preferences?: any;
  weight_goal_type?: string;
  weight_goal_deficit?: number;
  created_at?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
  checkPendingRecipeAfterAuth: () => void; // New function to handle recipe recovery
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => null,
  checkPendingRecipeAfterAuth: () => {} // Default no-op implementation
});

/**
 * Fetches user profile data from Supabase with error handling
 */
async function fetchUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authCompletedOnce, setAuthCompletedOnce] = useState(false);
  const { toast } = useToast();
  const setRecipe = useQuickRecipeStore(state => state.setRecipe);

  // Refresh profile function that can be called from any component
  const refreshProfile = async (): Promise<Profile | null> => {
    if (!user?.id) return null;
    
    try {
      const profileData = await fetchUserProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
      return profileData;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear state
      setSession(null);
      setUser(null);
      setProfile(null);
      
      // Clear auth state when signing out
      authStateManager.clearState();
      
      // Clear any recipe backups
      authStateManager.clearRecipeDataFallback();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Function to check and restore any pending recipe data after login
  const checkPendingRecipeAfterAuth = () => {
    if (!session?.user) return;
    
    try {
      // First check authStateManager for pending actions
      const nextAction = authStateManager.getNextPendingAction();
      if (nextAction && nextAction.type === 'save-recipe' && nextAction.data.recipe) {
        console.log("Found pending recipe in authStateManager:", nextAction.data.recipe);
        setRecipe(nextAction.data.recipe);
        return;
      }
      
      // Then check localStorage backup
      const recipeBackup = authStateManager.getRecipeDataFallback();
      if (recipeBackup && recipeBackup.recipe) {
        console.log("Found recipe backup in localStorage:", recipeBackup.recipe);
        setRecipe(recipeBackup.recipe);
        return;
      }
    } catch (error) {
      console.error("Error checking pending recipe data:", error);
    }
  };

  useEffect(() => {
    // Create a flag to track component mount state
    let isMounted = true;
    
    // First set up the auth state change listener - this MUST happen before checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;
      
      console.log('Auth state changed:', event);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Fetch profile separately to avoid Supabase deadlocks
        if (currentSession.user) {
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(() => {
            if (isMounted && currentSession.user) {
              fetchUserProfile(currentSession.user.id).then(data => {
                if (isMounted && data) {
                  setProfile(data);
                }
              }).finally(() => {
                // Mark auth as completed at least once
                if (isMounted) setAuthCompletedOnce(true);
              });
            }
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        authStateManager.clearState();
        
        // Mark auth as completed at least once
        setAuthCompletedOnce(true);
      }
      
      // Only update loading state for events after initialization
      if (event !== 'INITIAL_SESSION') {
        setLoading(false);
      }
    });
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (!isMounted) return;
        
        const currentSession = data.session;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            if (isMounted) {
              const profileData = await fetchUserProfile(currentSession.user.id);
              if (isMounted && profileData) {
                setProfile(profileData);
              }
              if (isMounted) {
                setLoading(false);
                setAuthCompletedOnce(true);
              }
            }
          }, 0);
        } else {
          setLoading(false);
          setAuthCompletedOnce(true);
        }
      } catch (err) {
        console.error('Error in getSession:', err);
        if (isMounted) {
          setLoading(false);
          setAuthCompletedOnce(true);
        }
      }
    };
    
    // Execute the session check
    checkSession();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // When auth completes for the first time, check for any pending recipe data
  useEffect(() => {
    if (authCompletedOnce && session?.user) {
      checkPendingRecipeAfterAuth();
    }
  }, [authCompletedOnce, session?.user]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      signOut,
      refreshProfile,
      checkPendingRecipeAfterAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

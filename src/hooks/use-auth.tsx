
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authStateManager } from '@/lib/auth/auth-state-manager';

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
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => null,
});

/**
 * Fetches user profile data from Supabase
 * @param userId The user ID to fetch profile data for
 * @returns The profile data or null if not found
 */
async function fetchUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Refresh profile function that can be called from any component
  const refreshProfile = useCallback(async (): Promise<Profile | null> => {
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
  }, [user?.id]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      
      // Clear auth state when signing out
      authStateManager.clearState();
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  // Handle token refresh errors
  const handleTokenRefreshError = useCallback(() => {
    // Clear auth state when token refresh fails
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
    
    // Clear stored auth state
    authStateManager.clearState();
  }, []);

  // Profile fetching function that avoids Supabase deadlocks
  const safelyFetchProfile = useCallback(async (userId: string) => {
    try {
      // Use the existing function to fetch profile
      const profileData = await fetchUserProfile(userId);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error in safelyFetchProfile:', error);
    }
  }, []);

  useEffect(() => {
    // Create a flag to track component mount state
    let isMounted = true;
    
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          // Handle sign out
          setSession(null);
          setUser(null);
          setProfile(null);
          
          // Clear auth state
          authStateManager.clearState();
        } else if (currentSession) {
          // Update session and user immediately
          setSession(currentSession);
          setUser(currentSession.user ?? null);
          
          // Fetch profile in a separate tick to avoid Supabase deadlocks
          if (currentSession.user) {
            // Using Promise instead of setTimeout for better control
            Promise.resolve().then(() => {
              if (isMounted && currentSession.user) {
                safelyFetchProfile(currentSession.user.id);
              }
            });
          }
        }
        
        if (event !== 'INITIAL_SESSION') {
          // Only set loading to false for non-initial events
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          handleTokenRefreshError();
          return;
        }
        
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch profile using Promise to avoid Supabase deadlocks
          Promise.resolve().then(() => {
            if (isMounted && currentSession.user) {
              safelyFetchProfile(currentSession.user.id);
            }
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in getSession:', err);
        if (isMounted) {
          handleTokenRefreshError();
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
  }, [handleTokenRefreshError, safelyFetchProfile]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      signOut,
      refreshProfile
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

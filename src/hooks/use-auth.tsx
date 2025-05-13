
import { createContext, useContext, useState, useEffect } from 'react';
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
  const { toast } = useToast();

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
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
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
              });
            }
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        authStateManager.clearState();
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
              }
            }
          }, 0);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in getSession:', err);
        if (isMounted) {
          setLoading(false);
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

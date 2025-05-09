
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const handleTokenRefreshError = () => {
    // Clear auth state when token refresh fails
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  useEffect(() => {
    // Set up the auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
        } else {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Defer profile fetching to avoid Supabase deadlocks
          if (currentSession?.user) {
            setTimeout(async () => {
              try {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', currentSession.user.id)
                  .single();
                
                setProfile(profileData);
              } catch (error) {
                console.error('Error fetching profile:', error);
              }
            }, 0);
          }
        }

        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        handleTokenRefreshError();
        return;
      }
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        try {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single()
            .then(({ data: profileData }) => {
              setProfile(profileData);
              setLoading(false);
            })
            .catch((error: any) => { // Fix: Use explicitly typed parameter
              console.error('Error fetching profile:', error);
              setLoading(false);
            });
        } catch (error) {
          console.error('Error setting up profile fetch:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }).catch((err: any) => { // Fixed TypeScript error by using a properly typed function parameter
      console.error('Error in getSession:', err);
      handleTokenRefreshError();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
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

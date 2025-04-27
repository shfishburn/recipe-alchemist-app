
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface NutritionPreferences {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietaryRestrictions?: string[];
  allergens?: string[];
  healthGoal?: string;
}

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  nutrition_preferences?: NutritionPreferences;
  weight_goal_type?: string;
  weight_goal_deficit?: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  user: null,
  profile: null
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const transformProfile = (data: any): Profile | null => {
    if (!data) return null;

    // Transform nutrition preferences to ensure type safety
    let nutrition_preferences: NutritionPreferences | undefined;
    if (data.nutrition_preferences) {
      const np = data.nutrition_preferences as any;
      nutrition_preferences = {
        dailyCalories: Number(np.dailyCalories) || 2000,
        macroSplit: {
          protein: Number(np.macroSplit?.protein) || 30,
          carbs: Number(np.macroSplit?.carbs) || 40,
          fat: Number(np.macroSplit?.fat) || 30,
        },
        dietaryRestrictions: Array.isArray(np.dietaryRestrictions) ? np.dietaryRestrictions : [],
        allergens: Array.isArray(np.allergens) ? np.allergens : [],
        healthGoal: typeof np.healthGoal === 'string' ? np.healthGoal : 'maintenance',
      };
    }

    return {
      id: data.id,
      username: data.username,
      avatar_url: data.avatar_url,
      nutrition_preferences,
      weight_goal_type: data.weight_goal_type,
      weight_goal_deficit: data.weight_goal_deficit,
    };
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          setProfile(transformProfile(data));
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        setProfile(transformProfile(data));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile }}>
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

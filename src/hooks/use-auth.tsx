
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: any | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication for now
  useEffect(() => {
    // Simulate loading auth state
    setTimeout(() => {
      // Uncomment to simulate a logged-in user
      // setUser({ id: '1', email: 'user@example.com' });
      // setProfile({ id: '1', user_id: '1', full_name: 'Test User' });
      // setSession({ access_token: 'mock-token' });
      setLoading(false);
    }, 1000);
  }, []);

  const logout = async () => {
    // Mock logout
    setUser(null);
    setProfile(null);
    setSession(null);
    return Promise.resolve();
  };

  const value = {
    user,
    profile,
    session,
    loading,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

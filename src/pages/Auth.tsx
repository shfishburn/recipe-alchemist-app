
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // For debugging
  React.useEffect(() => {
    console.log("Auth page rendered. Auth state:", { loading, session: session ? 'exists' : 'none' });
  }, [loading, session]);

  // Show a loader while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If already logged in, redirect to home page
  if (session) {
    console.log("Already authenticated, redirecting to home");
    toast({
      title: "Already logged in",
      description: "You are already authenticated",
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default Auth;

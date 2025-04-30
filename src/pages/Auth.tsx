
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';

const Auth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';
  
  // Store the referring page in sessionStorage on component mount
  useEffect(() => {
    if (location.state?.from) {
      sessionStorage.setItem('redirectPath', location.state.from.pathname);
    }
  }, [location.state]);

  // Show a loader while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If already logged in, redirect to stored path or home page
  if (session) {
    const redirectPath = sessionStorage.getItem('redirectPath') || from;
    console.log("Already authenticated, redirecting to:", redirectPath);
    // Clear the stored path after using it
    sessionStorage.removeItem('redirectPath');
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default Auth;

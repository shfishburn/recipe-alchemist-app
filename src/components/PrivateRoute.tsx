
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    // Store the current full location before redirecting to login
    // This includes pathname, search params, hash, and state
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    
    // Store any form data that was being processed
    const recipeGenerationData = sessionStorage.getItem('recipeGenerationSource');
    
    // Store route with current navigation state to restore after login
    sessionStorage.setItem('redirectAfterAuth', JSON.stringify({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      recipeGenerationData: recipeGenerationData ? JSON.parse(recipeGenerationData) : null
    }));
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

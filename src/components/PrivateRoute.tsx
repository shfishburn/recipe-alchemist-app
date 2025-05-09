
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { cleanupUIState } from '@/utils/dom-cleanup';
import { toast } from 'sonner';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  // Clean up UI state when this component mounts
  useEffect(() => {
    // This helps clean up any lingering overlays from previous auth state changes
    cleanupUIState();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    // Clean up UI state before redirecting
    cleanupUIState();
    
    // Store the current full location before redirecting to login
    // This includes pathname, search params, hash, and state
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    
    // Check if we're on a protected resource page that requires auth
    const isProtectedResource = location.pathname.startsWith('/quick-recipe') || 
                              location.pathname.startsWith('/recipes') ||
                              location.pathname.startsWith('/recipe/');
    
    // Only show the auth toast for protected resources
    if (isProtectedResource) {
      toast.error("Please sign in to access this page");
    }
    
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

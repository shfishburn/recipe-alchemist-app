
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';

const Auth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';
  
  // Store the complete referring location on component mount
  // This includes pathname, search params, and state
  useEffect(() => {
    if (location.state?.from) {
      // Store the full location object with path, search params and any state
      const locationData = {
        pathname: location.state.from.pathname,
        search: location.state.from.search || '',
        hash: location.state.from.hash || '',
        state: location.state.from.state || null
      };
      
      // Store as stringified JSON to preserve all properties
      sessionStorage.setItem('redirectAfterAuth', JSON.stringify(locationData));
      console.log('Stored redirect location:', locationData);
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
    let redirectTo = from;
    let redirectState = {};
    
    // Try to get the stored location data
    const storedLocationData = sessionStorage.getItem('redirectAfterAuth');
    
    if (storedLocationData) {
      try {
        const locationData = JSON.parse(storedLocationData);
        redirectTo = locationData.pathname;
        
        // Recreate the URL with search params and hash if they exist
        if (locationData.search) redirectTo += locationData.search;
        if (locationData.hash) redirectTo += locationData.hash;
        
        // Preserve any state that might have been stored
        if (locationData.state) {
          redirectState = locationData.state;
        }
        
        // Check if we need to resume recipe generation
        if (locationData.recipeGenerationData) {
          // Store recipe data to be picked up after navigation
          sessionStorage.setItem('recipeGenerationSource', 
            JSON.stringify(locationData.recipeGenerationData));
        }
        
        console.log("Redirecting to:", redirectTo, "with state:", redirectState);
      } catch (error) {
        console.error("Error parsing stored location:", error);
      }
    }
    
    // Clear the stored path after using it
    sessionStorage.removeItem('redirectAfterAuth');
    
    // Remove any overflow-hidden class that might be causing touch issues
    document.body.classList.remove('overflow-hidden');
    
    return <Navigate to={redirectTo} state={redirectState} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default Auth;

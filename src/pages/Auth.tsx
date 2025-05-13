
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';
import { cleanupUIState } from '@/utils/dom-cleanup';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

const Auth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = useQuickRecipeStore(state => state.recipe);
  const from = location.state?.from?.pathname || '/';
  
  // Store the complete referring location on component mount
  useEffect(() => {
    // If we have a recipe in the store, make sure to use the backup
    // mechanism to ensure it survives page refreshes or navigations
    if (recipe) {
      authStateManager.storeRecipeDataFallback(recipe);
      console.log('Stored recipe backup from Auth page');
    }

    if (location.state?.from) {
      // Store the full location object with path, search params and any state
      authStateManager.setRedirectAfterAuth(
        location.state.from.pathname,
        {
          search: location.state.from.search || '',
          hash: location.state.from.hash || '',
          state: location.state.from.state || null
        }
      );
      console.log('Stored redirect location:', location.state.from);
    } else if (location.state?.returnTo) {
      // Support for direct returnTo path specification
      authStateManager.setRedirectAfterAuth(
        location.state.returnTo,
        {
          state: location.state || null
        }
      );
      console.log('Stored redirect from returnTo:', location.state.returnTo);
    }
  }, [location.state, recipe]);

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
    // Check for active loading overlays before cleanup
    const hasActiveLoadingOverlay = document.querySelector('.loading-overlay.active-loading');
    
    if (!hasActiveLoadingOverlay) {
      // Clean up any UI elements that might be lingering
      cleanupUIState();
    }
    
    // First, check for recipe data in localStorage fallback
    const recipeBackup = authStateManager.getRecipeDataFallback();
    if (recipeBackup && recipeBackup.recipe) {
      console.log("Found recipe backup in localStorage", recipeBackup);
      return (
        <Navigate 
          to={recipeBackup.sourceUrl || '/recipe-preview'}
          state={{
            pendingSave: true,
            resumingAfterAuth: true,
            recipeData: recipeBackup.recipe,
            timestamp: Date.now()
          }} 
          replace 
        />
      );
    }
    
    // Get the stored redirect data
    const redirectData = authStateManager.getRedirectAfterAuth();
    let redirectTo = from;
    let redirectState = {};
    
    if (redirectData) {
      redirectTo = redirectData.pathname;
      
      // Recreate the URL with search params and hash if they exist
      if (redirectData.search) redirectTo += redirectData.search;
      if (redirectData.hash) redirectTo += redirectData.hash;
      
      // Preserve any state that might have been stored
      if (redirectData.state) {
        redirectState = redirectData.state;
      }
      
      // Check if we have pending actions
      const nextAction = authStateManager.getNextPendingAction();
      if (nextAction && !nextAction.executed) {
        // If the action is recipe generation, add resuming flags
        if (nextAction.type === 'generate-recipe') {
          redirectState = {
            ...redirectState,
            resumingGeneration: true,
            recipeData: { 
              formData: nextAction.data.formData,
              path: nextAction.sourceUrl
            }
          };
          console.log("Found recipe generation data to resume:", {
            formData: nextAction.data.formData ? "present" : "missing",
            path: nextAction.sourceUrl || "not set"
          });
        } else if (nextAction.type === 'save-recipe') {
          // If we're returning to a recipe page with data
          redirectState = {
            ...redirectState,
            pendingSave: true,
            resumingAfterAuth: true,
            timestamp: Date.now()
          };
          console.log("Found recipe save data to resume");
        }
      }
      
      console.log("Redirecting after auth to:", redirectTo, "with state:", redirectState);
      
      // Clear the redirect after using it
      authStateManager.clearRedirectAfterAuth();
    }
    
    return <Navigate to={redirectTo} state={redirectState} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default Auth;

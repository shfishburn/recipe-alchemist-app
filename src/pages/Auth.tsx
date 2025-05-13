
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';
import { cleanupUIState } from '@/utils/dom-cleanup';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

// Define interface for custom location state to fix TypeScript errors
interface NavigationState {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
    state?: Record<string, unknown>;
  };
  returnTo?: string;
  pendingSave?: boolean;
  resumingAfterAuth?: boolean;
  resumingGeneration?: boolean;
  recipeData?: unknown;
  timestamp?: number;
  [key: string]: unknown; // Allow for other properties
}

const Auth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = useQuickRecipeStore(state => state.recipe);
  
  // Get the state with proper typing
  const locationState = location.state as NavigationState | null;
  const from = locationState?.from?.pathname || '/';
  
  // Store the complete referring location on component mount
  useEffect(() => {
    // If we have a recipe in the store, make sure to use the backup
    // mechanism to ensure it survives page refreshes or navigations
    if (recipe) {
      authStateManager.storeRecipeDataFallback(recipe);
      console.log('Stored recipe backup from Auth page:', recipe.title);
    }

    if (locationState?.from) {
      // Store the full location object with path, search params and any state
      authStateManager.setRedirectAfterAuth(
        locationState.from.pathname,
        {
          search: locationState.from.search || '',
          hash: locationState.from.hash || '',
          state: {
            ...(locationState.from.state || {}),
            // Add additional state flags for recipe recovery
            resumingAfterAuth: true,
            pendingSave: locationState.pendingSave || false,
            timestamp: Date.now()
          }
        }
      );
      console.log('Stored redirect location with enhanced state:', locationState.from.pathname);
    } else if (locationState?.returnTo) {
      // Support for direct returnTo path specification
      authStateManager.setRedirectAfterAuth(
        locationState.returnTo,
        {
          state: {
            // Create a new object for state rather than trying to spread locationState
            resumingAfterAuth: true,
            timestamp: Date.now(),
            // Include other properties if needed
            ...(locationState || {})
          }
        }
      );
      console.log('Stored redirect from returnTo with enhanced state:', locationState.returnTo);
    }
  }, [locationState, recipe]);

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
      console.log("Found recipe backup in localStorage, redirecting to recipe preview", recipeBackup);
      return (
        <Navigate 
          to='/recipe-preview'
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
    let redirectState: Record<string, unknown> = { timestamp: Date.now() };
    
    if (redirectData) {
      redirectTo = redirectData.pathname;
      
      // Recreate the URL with search params and hash if they exist
      if (redirectData.search) redirectTo += redirectData.search;
      if (redirectData.hash) redirectTo += redirectData.hash;
      
      // Preserve any state that might have been stored
      if (redirectData.state) {
        redirectState = {
          ...redirectState,
          ...(redirectData.state as Record<string, unknown>),
          resumingAfterAuth: true // Always add this flag
        };
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
            recipeData: nextAction.data.recipe,
            timestamp: Date.now()
          };
          console.log("Found recipe save data to resume, adding to redirect state");
        }
      }
      
      console.log("Redirecting after auth to:", redirectTo, "with state:", redirectState);
      
      // Clear the redirect after using it
      authStateManager.clearRedirectAfterAuth();
    } else if (from === '/recipe-preview' && (recipe || recipeBackup?.recipe)) {
      // Special case for recipe preview - ensure we have data
      const recipeData = recipe || recipeBackup?.recipe;
      redirectState = {
        ...redirectState,
        pendingSave: true,
        resumingAfterAuth: true,
        recipeData,
        timestamp: Date.now()
      };
      console.log("Redirecting to recipe-preview with recipe data");
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

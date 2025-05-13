
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import type { QuickRecipe } from '@/types/quick-recipe';
import { authStateManager } from '@/lib/auth/auth-state-manager';

export function useRecipePreview() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get store state and actions
  const storeRecipe = useQuickRecipeStore(state => state.recipe);
  const setRecipe = useQuickRecipeStore(state => state.setRecipe);
  const formData = useQuickRecipeStore(state => state.formData);
  const isLoading = useQuickRecipeStore(state => state.isLoading);
  const storeSetLoading = useQuickRecipeStore(state => state.setLoading);
  const storeSetError = useQuickRecipeStore(state => state.setError);
  
  // Check for recipe in location state (fix for race condition)
  const recipeFromLocation = location.state?.recipe as QuickRecipe | undefined;
  
  // Use recipe from location state if available, otherwise use store recipe
  const [recipe, setLocalRecipe] = useState<QuickRecipe | null>(recipeFromLocation || storeRecipe);
  
  // Navigation state variables
  const isResuming = location.state?.resumingAfterAuth === true;
  const hasPendingSave = location.state?.pendingSave === true;
  
  // Sync local recipe state with store when store updates
  useEffect(() => {
    if (storeRecipe && (!recipe || storeRecipe.title !== recipe.title)) {
      console.log("Updating local recipe from store");
      setLocalRecipe(storeRecipe);
    }
  }, [storeRecipe, recipe]);
  
  // If we have recipe from location state but not in store, update the store
  useEffect(() => {
    if (recipeFromLocation && !storeRecipe) {
      console.log("Saving recipe from location state to store");
      setRecipe(recipeFromLocation);
    }
  }, [recipeFromLocation, storeRecipe, setRecipe]);
  
  // Check if we should redirect
  useEffect(() => {
    // Don't redirect if any of these conditions are true:
    const shouldStayOnPage = !!recipe || 
                           isLoading || 
                           isResuming || 
                           hasPendingSave ||
                           !!authStateManager.getNextPendingAction();
    
    if (!shouldStayOnPage) {
      console.log("No recipe available from store or location state, redirecting to home page");
      navigate('/');
    }
  }, [recipe, isLoading, navigate, isResuming, hasPendingSave]);
  
  // If we're loading, redirect to the loading page
  useEffect(() => {
    if (isLoading) {
      console.log("Recipe is loading, redirecting to loading page");
      navigate('/loading', { 
        state: { 
          fromRecipePreview: true,
          timestamp: Date.now()
        }
      });
    }
  }, [isLoading, navigate]);
  
  // Handle retry logic
  const handleRetry = () => {
    if (formData) {
      storeSetLoading(true);
      try {
        // Retry will go through the loading page
        navigate('/loading', { 
          state: { 
            isRetrying: true,
          }
        });
      } catch (e: unknown) {
        console.error("Error retrying recipe generation:", e);
        storeSetLoading(false);
        const message = e instanceof Error ? e.message : "Failed to retry recipe generation";
        storeSetError(message);
      }
    }
  };

  return {
    recipe,
    formData,
    isLoading,
    handleRetry,
    isResuming,
    hasPendingSave
  };
}

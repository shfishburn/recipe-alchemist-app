
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { toast } from 'sonner';
import { QuickRecipe } from '@/types/quick-recipe';
import { authStateManager, PendingActionType } from '@/lib/auth/auth-state-manager';

// Define the key for recipe actions in authStateManager
export const RECIPE_ACTION_TYPE: PendingActionType = 'save-recipe';

export function useRecipeSaveState() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const { open: openAuthDrawer } = useAuthDrawer();
  const navigate = useNavigate();

  /**
   * Store recipe for saving after authentication using authStateManager
   */
  const savePendingRecipe = (recipe: QuickRecipe) => {
    try {
      // Queue the action using authStateManager instead of sessionStorage
      const actionId = authStateManager.queueAction({
        type: RECIPE_ACTION_TYPE,
        data: { recipe },
        sourceUrl: window.location.pathname
      });
      
      console.log("Stored pending recipe with action ID:", actionId);
      return true;
    } catch (error) {
      console.error('Failed to store pending recipe:', error);
      return false;
    }
  };

  /**
   * Check if there's a pending recipe save request
   */
  const getPendingRecipe = () => {
    try {
      // Get the next pending action of type 'save-recipe'
      const pendingActions = authStateManager.getPendingActions();
      const saveAction = pendingActions.find(a => 
        a.type === RECIPE_ACTION_TYPE && 
        !a.executed &&
        a.data?.recipe
      );
      
      if (saveAction) {
        return {
          recipe: saveAction.data.recipe as QuickRecipe,
          timestamp: saveAction.timestamp,
          sourceUrl: saveAction.sourceUrl
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to retrieve pending recipe:', error);
      return null;
    }
  };

  /**
   * Clear the pending recipe save
   */
  const clearPendingRecipe = () => {
    try {
      // Find any pending recipe actions and remove them
      const pendingActions = authStateManager.getPendingActions();
      const saveActions = pendingActions.filter(a => a.type === RECIPE_ACTION_TYPE);
      
      // Mark all as executed or remove them
      saveActions.forEach(action => {
        authStateManager.markActionExecuted(action.id);
      });
      
      console.log(`Cleared ${saveActions.length} pending recipe actions`);
    } catch (error) {
      console.error('Failed to clear pending recipe:', error);
    }
  };

  /**
   * Reset save success state
   */
  const resetSaveSuccess = () => {
    setSaveSuccess(false);
    setSavedSlug(null);
  };

  /**
   * Set a successful save with the recipe slug
   */
  const handleSaveSuccess = (slug: string) => {
    setSaveSuccess(true);
    setSavedSlug(slug);
    clearPendingRecipe();
    
    toast.success("Recipe saved successfully!");
  };

  /**
   * Navigate to the saved recipe
   */
  const navigateToSavedRecipe = () => {
    if (savedSlug) {
      navigate(`/recipes/${savedSlug}`);
    }
  };

  /**
   * Request authentication before saving
   */
  const requestAuthForSave = (recipe: QuickRecipe) => {
    // Store the recipe for later
    if (savePendingRecipe(recipe)) {
      toast.info("Please sign in to save your recipe", {
        duration: 4000,
        action: {
          label: "Sign In",
          onClick: openAuthDrawer
        }
      });
      
      // Open auth drawer
      openAuthDrawer();
      return true;
    }
    return false;
  };

  return {
    isSaving,
    setIsSaving,
    saveSuccess,
    setSaveSuccess: handleSaveSuccess,
    resetSaveSuccess,
    savedSlug,
    requestAuthForSave,
    getPendingRecipe,
    clearPendingRecipe,
    navigateToSavedRecipe
  };
}

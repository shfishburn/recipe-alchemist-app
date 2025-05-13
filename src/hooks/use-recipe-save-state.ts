
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { toast } from 'sonner';
import { QuickRecipe } from '@/types/quick-recipe';
import { authStateManager, PendingActionType } from '@/lib/auth/auth-state-manager';
import { useRecipeDataRecovery } from '@/hooks/use-recipe-data-recovery';

// Define the key for recipe actions in authStateManager
export const RECIPE_ACTION_TYPE: PendingActionType = 'save-recipe';

export function useRecipeSaveState() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const { open: openAuthDrawer } = useAuthDrawer();
  const navigate = useNavigate();
  const { ensureRecipeHasId } = useRecipeDataRecovery();

  /**
   * Store recipe for saving after authentication using authStateManager
   */
  const savePendingRecipe = (recipe: QuickRecipe) => {
    try {
      // Ensure recipe has an ID for reliable recovery
      const recipeId = ensureRecipeHasId(recipe);
      
      // Queue the action using authStateManager
      const actionId = authStateManager.queueAction({
        type: RECIPE_ACTION_TYPE,
        data: { recipe, recipeId },
        sourceUrl: window.location.pathname
      });
      
      // Also store in localStorage as a fallback mechanism
      authStateManager.storeRecipeDataFallback(recipe);
      
      console.log("Stored pending recipe with action ID:", actionId, "and recipeId:", recipeId);
      return recipeId || true;
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
        console.log("Found pending recipe action:", saveAction.id, "with recipeId:", saveAction.data.recipeId);
        return {
          recipe: saveAction.data.recipe as QuickRecipe,
          recipeId: saveAction.data.recipeId as string | undefined,
          timestamp: saveAction.timestamp,
          sourceUrl: saveAction.sourceUrl
        };
      }
      
      // Try localStorage fallback if no pending action
      const recipeBackup = authStateManager.getRecipeDataFallback();
      if (recipeBackup && recipeBackup.recipe) {
        console.log("Found recipe backup in localStorage with path:", recipeBackup.sourceUrl || "unknown");
        return {
          recipe: recipeBackup.recipe as QuickRecipe,
          timestamp: recipeBackup.timestamp,
          sourceUrl: recipeBackup.sourceUrl
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
      
      // Also clear localStorage backup
      authStateManager.clearRecipeDataFallback();
      
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
    // Store the current URL as a URL parameter for more robust state preservation
    const currentUrl = window.location.pathname;
    
    // Ensure recipe has an ID for better recovery
    const recipeId = ensureRecipeHasId(recipe);
    
    // Store the recipe for later
    if (savePendingRecipe(recipe)) {
      // Set the redirect URL for auth return
      // If we have a recipe ID, make sure it's in the return path
      const redirectPath = recipeId && currentUrl === '/recipe-preview' 
        ? `/recipe-preview/${recipeId}` 
        : currentUrl;
      
      authStateManager.setRedirectAfterAuth(redirectPath, {
        state: {
          pendingSave: true,
          resumingAfterAuth: true,
          recipeId,
          timestamp: Date.now()
        }
      });
      
      toast.info("Please sign in to save your recipe", {
        duration: 4000,
        action: {
          label: "Sign In",
          onClick: openAuthDrawer
        }
      });
      
      // Open auth drawer
      openAuthDrawer();
      console.log("Auth drawer opened with redirect path:", redirectPath);
      return recipeId || true;
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

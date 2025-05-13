
import { useCallback } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { authStateManager, PendingActionType } from '@/lib/auth/auth-state-manager';

// Define the key for recipe actions in authStateManager
export const RECIPE_ACTION_TYPE: PendingActionType = 'save-recipe';

/**
 * Hook for managing recipe saving state and storage
 */
export function useSaveRecipeState() {
  /**
   * Store recipe for saving after authentication using authStateManager
   * @param recipe The recipe to store
   * @param recipeId The recipe ID (optional)
   * @param sourceUrl The source URL (optional)
   * @returns The action ID or false if storage failed
   */
  const storeRecipeForAuth = useCallback((
    recipe: QuickRecipe, 
    recipeId?: string, 
    sourceUrl?: string
  ) => {
    try {
      // Queue the action using authStateManager
      const actionId = authStateManager.queueAction({
        type: RECIPE_ACTION_TYPE,
        data: { recipe, recipeId },
        sourceUrl: sourceUrl || window.location.pathname
      });
      
      // Also store in localStorage as a fallback mechanism
      authStateManager.storeRecipeDataFallback(recipe);
      
      // Store the current URL for more robust state preservation
      let currentUrl = sourceUrl || window.location.pathname;
      
      // If we have a recipe ID, ensure it's included in the return path
      if (recipeId && !currentUrl.includes(`/recipe-preview/${recipeId}`)) {
        // Check if we're on the recipe-preview base path
        if (currentUrl === '/recipe-preview') {
          currentUrl = `/recipe-preview/${recipeId}`;
        }
      }
      
      authStateManager.setRedirectAfterAuth(currentUrl, {
        state: { 
          pendingSave: true,
          resumingAfterAuth: true,
          recipeId,
          recipeData: recipe, // Include recipe directly in state
          timestamp: Date.now()
        }
      });
      
      console.log("Stored pending recipe with action ID:", actionId);
      return actionId || recipeId || true;
    } catch (error) {
      console.error('Failed to store pending recipe:', error);
      return false;
    }
  }, []);

  /**
   * Check if there's a pending recipe save request
   */
  const getPendingRecipe = useCallback(() => {
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
          recipeId: saveAction.data.recipeId as string | undefined,
          timestamp: saveAction.timestamp,
          sourceUrl: saveAction.sourceUrl
        };
      }
      
      // Try localStorage fallback if no pending action
      const recipeBackup = authStateManager.getRecipeDataFallback();
      if (recipeBackup && recipeBackup.recipe) {
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
  }, []);

  /**
   * Clear the pending recipe save and related storage
   * Safely removes only recipe-related data
   */
  const clearStoredRecipes = useCallback(() => {
    try {
      // Find any pending recipe actions and remove them
      const pendingActions = authStateManager.getPendingActions();
      const saveActions = pendingActions.filter(a => a.type === RECIPE_ACTION_TYPE);
      
      // Mark all recipe actions as executed
      saveActions.forEach(action => {
        authStateManager.markActionExecuted(action.id);
      });
      
      // Clear localStorage backup for recipes only
      authStateManager.clearRecipeDataFallback();
      
      // Clear any recipe-specific cached data
      // This is safer than removing all localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('recipe_')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the identified recipe keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`Cleared ${saveActions.length} pending recipe actions and ${keysToRemove.length} localStorage entries`);
    } catch (error) {
      console.error('Failed to clear pending recipe:', error);
    }
  }, []);

  return {
    storeRecipeForAuth,
    getPendingRecipe,
    clearStoredRecipes
  };
}

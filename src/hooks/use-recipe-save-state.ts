
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { toast } from 'sonner';
import { QuickRecipe } from '@/types/quick-recipe';
import { PendingActionType } from '@/lib/auth/auth-state-manager';
import { useRecipeDataRecovery } from '@/hooks/use-recipe-data-recovery';
import { useSaveRecipeState as useSaveRecipeStateInternal } from '@/components/quick-recipe/hooks/use-save-recipe-state';

// Define the key for recipe actions in authStateManager
export const RECIPE_ACTION_TYPE: PendingActionType = 'save-recipe';

export function useRecipeSaveState() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const { open: openAuthDrawer } = useAuthDrawer();
  const navigate = useNavigate();
  const { ensureRecipeHasId } = useRecipeDataRecovery();
  const { storeRecipeForAuth, getPendingRecipe, clearStoredRecipes } = useSaveRecipeStateInternal();

  /**
   * Store recipe for saving after authentication
   */
  const savePendingRecipe = (recipe: QuickRecipe) => {
    try {
      // Ensure recipe has an ID for reliable recovery
      const recipeId = ensureRecipeHasId(recipe);
      return storeRecipeForAuth(recipe, recipeId);
    } catch (error) {
      console.error('Failed to store pending recipe:', error);
      return false;
    }
  };

  /**
   * Clear the pending recipe save
   */
  const clearPendingRecipe = () => {
    clearStoredRecipes();
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
    // Ensure recipe has an ID for better recovery
    const recipeId = ensureRecipeHasId(recipe);
    
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

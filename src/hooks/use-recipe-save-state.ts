
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { toast } from 'sonner';
import { QuickRecipe } from '@/types/quick-recipe';

// Key for storing pending recipe save in sessionStorage
const PENDING_SAVE_KEY = 'pendingSaveRecipe';

// Define types for pending save data
interface PendingSaveData {
  recipe: QuickRecipe;
  timestamp: number;
  sourceUrl: string;
}

export function useRecipeSaveState() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const { open: openAuthDrawer } = useAuthDrawer();
  const navigate = useNavigate();

  /**
   * Validates if the data is a valid PendingSaveData object
   */
  const isValidPendingSaveData = (data: any): data is PendingSaveData => {
    return (
      data && 
      typeof data.timestamp === 'number' && 
      typeof data.sourceUrl === 'string' &&
      data.recipe !== undefined
    );
  };

  /**
   * Store recipe for saving after authentication
   */
  const savePendingRecipe = (recipe: QuickRecipe) => {
    try {
      const saveData: PendingSaveData = {
        recipe,
        timestamp: Date.now(),
        sourceUrl: window.location.pathname
      };
      
      sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(saveData));
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
      const savedData = sessionStorage.getItem(PENDING_SAVE_KEY);
      if (!savedData) return null;
      
      const parsedData = JSON.parse(savedData);
      if (isValidPendingSaveData(parsedData)) {
        return parsedData;
      } else {
        console.error('Invalid pending recipe data format');
        sessionStorage.removeItem(PENDING_SAVE_KEY);
        return null;
      }
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
      sessionStorage.removeItem(PENDING_SAVE_KEY);
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

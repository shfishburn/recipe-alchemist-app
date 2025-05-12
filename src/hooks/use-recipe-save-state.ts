
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for managing recipe save state
 * Centralizes all save-related state and navigation logic
 */
export function useRecipeSaveState() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  /**
   * Reset save success state
   */
  const resetSaveSuccess = useCallback(() => {
    setSaveSuccess(false);
  }, []);

  /**
   * Navigate to saved recipe detail page
   */
  const navigateToSavedRecipe = useCallback(() => {
    if (savedSlug) {
      navigate(`/recipes/${savedSlug}`);
    }
  }, [navigate, savedSlug]);

  /**
   * Set the save as successful and store the slug
   */
  const setSaveSuccessful = useCallback((slug?: string) => {
    setSaveSuccess(true);
    if (slug) {
      setSavedSlug(slug);
    }
  }, []);

  return {
    isSaving,
    setIsSaving,
    saveSuccess,
    setSaveSuccess: setSaveSuccessful,
    resetSaveSuccess,
    savedSlug,
    navigateToSavedRecipe
  };
}

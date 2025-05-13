
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRecipeSaveState } from '@/hooks/use-recipe-save-state';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { useAuth } from '@/hooks/use-auth';
import type { QuickRecipe } from '@/types/quick-recipe';

export function useRecipeSaveHandler(recipe: QuickRecipe | null, isResuming: boolean, hasPendingSave: boolean) {
  const { session } = useAuth();
  const { saveRecipe, isSaving: isSavingRecipe } = useQuickRecipeSave();
  const [isSaving, setIsSaving] = useState(false);
  
  // Use our centralized save state management hook
  const {
    saveSuccess,
    setSaveSuccess,
    resetSaveSuccess,
    savedSlug,
    navigateToSavedRecipe,
    getPendingRecipe,
    clearPendingRecipe
  } = useRecipeSaveState();

  // Handle post-authentication actions
  useEffect(() => {
    const handlePostAuthActions = async () => {
      // First check for an action in authStateManager
      const nextAction = authStateManager.getNextPendingAction();
      
      // Only proceed if we either have a pending action or we're resuming after auth
      if ((isResuming && hasPendingSave && session) || 
          (nextAction && nextAction.type === 'save-recipe' && !nextAction.executed && session)) {
        
        try {
          // Mark the start of handling auth actions for debugging
          console.log("Processing post-authentication recipe save actions");
          let pendingData;
          
          // First priority: check for action from authStateManager
          if (nextAction && nextAction.type === 'save-recipe') {
            pendingData = {
              recipe: nextAction.data.recipe,
              timestamp: nextAction.timestamp,
              sourceUrl: nextAction.sourceUrl
            };
            // Mark this action as being processed
            authStateManager.markActionExecuted(nextAction.id);
            console.log("Found pending save action in authStateManager:", nextAction.id);
          } else {
            // Fallback: check for legacy pending recipe in our hook
            pendingData = getPendingRecipe();
            console.log("Checked for legacy pending save recipe:", pendingData ? "found" : "not found");
          }
          
          if (pendingData?.recipe) {
            // We have a recipe to save
            toast.loading("Saving your recipe after login...");
            setIsSaving(true);
            
            try {
              const savedData = await saveRecipe(pendingData.recipe);
              
              if (savedData && savedData.slug) {
                // Use the centralized state management
                setSaveSuccess(savedData.slug);
                toast.success("Recipe saved successfully!");
                
                // Clear the pending save
                clearPendingRecipe();
                
                console.log("Successfully saved recipe after authentication:", savedData.slug);
              }
            } catch (error) {
              console.error("Error saving recipe after authentication:", error);
              toast.error("Failed to save recipe after login");
            } finally {
              setIsSaving(false);
            }
          }
        } catch (error) {
          console.error("Error handling post-auth save:", error);
        }
      } else if (isResuming && !session) {
        // If we're supposed to be resuming but there's no session,
        // that means the authentication probably failed
        toast.error("Authentication required to save your recipe");
      }
    };
    
    handlePostAuthActions();
  }, [isResuming, hasPendingSave, session, getPendingRecipe, saveRecipe, clearPendingRecipe, setSaveSuccess]);

  // Add automatic navigation effect when save is successful
  useEffect(() => {
    if (saveSuccess && savedSlug) {
      // Add a small delay to allow the user to see the success state
      const navigationTimer = setTimeout(() => {
        console.log('Auto-navigating to saved recipe:', savedSlug);
        navigateToSavedRecipe();
      }, 800); // 800ms delay for better UX
      
      return () => clearTimeout(navigationTimer);
    }
  }, [saveSuccess, savedSlug, navigateToSavedRecipe]);

  const handleSaveRecipe = async () => {
    if (!recipe) {
      toast.error("Cannot save: Recipe data is missing");
      return;
    }

    // Set saving state to true
    setIsSaving(true);

    try {
      // Validate recipe has required fields
      if (!recipe.title || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        toast.error("Cannot save: Recipe is missing required information");
        setIsSaving(false);
        return;
      }

      const savedData = await saveRecipe(recipe);
      
      if (savedData && savedData.id && savedData.slug) {
        // Use the centralized state management
        setSaveSuccess(savedData.slug);
        
        // Show success toast with navigation action button (as backup for automatic navigation)
        toast.success("Recipe saved successfully!", {
          duration: 3000,
          action: {
            label: "View Recipe",
            onClick: navigateToSavedRecipe
          }
        });
      } else if (!savedData && !session) {
        // This means user was redirected to auth - we don't need an error message
        // The auth component will handle the flow
        setIsSaving(false);
      } else {
        // Handle case where savedData is falsy but no error was thrown
        toast.warning("Recipe was not saved properly. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save recipe:", error);
      
      // More detailed error feedback based on error type
      if (error instanceof Error) {
        // Use actual error message if available
        toast.error(`Failed to save recipe: ${error.message || "Please try again."}`);
      } else {
        toast.error("Failed to save recipe. Please try again.");
      }
      
      // Reset save success state on error
      resetSaveSuccess();
    } finally {
      // Always reset saving state when done
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    isSavingRecipe,
    saveSuccess,
    resetSaveSuccess,
    savedSlug,
    handleSaveRecipe
  };
}

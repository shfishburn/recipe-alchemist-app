import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { PageContainer } from '@/components/ui/containers';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { toast } from 'sonner';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { useRecipeSaveState } from '@/hooks/use-recipe-save-state';
import { useAuth } from '@/hooks/use-auth';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { QuickRecipe } from '@/types/quick-recipe';

const RecipePreviewPage: React.FC = () => {
  const recipe = useQuickRecipeStore(state => state.recipe) as QuickRecipe | null;
  const formData = useQuickRecipeStore(state => state.formData);
  const isLoading = useQuickRecipeStore(state => state.isLoading);
  const storeSetLoading = useQuickRecipeStore(state => state.setLoading);
  const storeSetError = useQuickRecipeStore(state => state.setError);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { saveRecipe, isSaving: isSavingRecipe } = useQuickRecipeSave();
  const [debugMode, setDebugMode] = useState(false);
  const { session } = useAuth();
  
  // Use our centralized save state management hook
  const {
    isSaving,
    setIsSaving,
    saveSuccess,
    setSaveSuccess,
    resetSaveSuccess,
    savedSlug,
    navigateToSavedRecipe,
    getPendingRecipe,
    clearPendingRecipe
  } = useRecipeSaveState();
  
  // Check if we're resuming from authentication
  const isResuming = location.state?.resumingAfterAuth === true;
  const hasPendingSave = location.state?.pendingSave === true;

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
              // Ensure the recipe conforms to QuickRecipe type
              const quickRecipeData: QuickRecipe = {
                ...pendingData.recipe,
                servings: pendingData.recipe.servings || 1 // Default value if missing
              };
              
              const savedData = await saveRecipe(quickRecipeData);
              
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
  }, [isResuming, hasPendingSave, session, getPendingRecipe, saveRecipe, clearPendingRecipe, setSaveSuccess, setIsSaving]);

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

      // Normalize the recipe to ensure it has all required fields
      // Always make sure instructions exists (from steps if needed)
      const normalizedRecipe: QuickRecipe = {
        ...recipe,
        // Ensure both formats are available (steps and instructions)
        instructions: recipe.instructions || recipe.steps || [],
        // Ensure servings exists (required for QuickRecipe)
        servings: recipe.servings || 1
      };

      const savedData = await saveRecipe(normalizedRecipe);
      
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

  const handleRetry = useCallback(async () => {
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
  }, [formData, navigate, storeSetLoading, storeSetError]);
  
  // If there's no recipe, redirect to home page, but only if we're not in the middle of 
  // authentication flow or resuming from a previous state
  useEffect(() => {
    // Don't redirect if any of these conditions are true:
    // 1. We have a recipe
    // 2. We're loading
    // 3. We're resuming from auth
    // 4. We have pending save action
    const shouldStayOnPage = !!recipe || 
                           isLoading || 
                           isResuming || 
                           hasPendingSave ||
                           !!authStateManager.getNextPendingAction();
    
    if (!shouldStayOnPage) {
      console.log("No recipe or auth state available, redirecting to home page");
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
  
  // Toggle debug mode function - keeping function but removing UI button
  const toggleDebugMode = () => setDebugMode(prev => !prev);
  
  // If no recipe, show nothing (will redirect in useEffect)
  if (!recipe) {
    return null;
  }
  
  // Determine if we should show loading overlay (either store saving state or local saving state)
  const showLoadingOverlay = isSavingRecipe || isSaving;
  
  return (
    <PageContainer>
      {showLoadingOverlay && (
        <LoadingOverlay isOpen={showLoadingOverlay}>
          <div className="p-6 flex flex-col items-center gap-4 text-center">
            <h3 className="text-lg font-semibold">Saving your recipe...</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we save your delicious creation.
            </p>
          </div>
        </LoadingOverlay>
      )}
      <div className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <div className="flex justify-center items-center">
          {/* Centered Recipe Preview heading */}
          <h1 className="text-2xl font-bold text-center">
            Recipe Preview
          </h1>
        </div>
      
        <div className="space-y-8">
          <QuickRecipeDisplay 
            recipe={recipe} 
            onSave={handleSaveRecipe}
            isSaving={showLoadingOverlay}
            saveSuccess={saveSuccess}
            debugMode={debugMode}
            onResetSaveSuccess={resetSaveSuccess}
            savedSlug={savedSlug}
          />
          <QuickRecipeRegeneration 
            formData={formData} 
            isLoading={isLoading} 
            onRetry={handleRetry} 
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default RecipePreviewPage;

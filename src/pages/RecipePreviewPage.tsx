
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
import { useRecipeDataRecovery } from '@/hooks/use-recipe-data-recovery';

const RecipePreviewPage: React.FC = () => {
  const recipe = useQuickRecipeStore(state => state.recipe);
  const formData = useQuickRecipeStore(state => state.formData);
  const isLoading = useQuickRecipeStore(state => state.isLoading);
  const storeSetLoading = useQuickRecipeStore(state => state.setLoading);
  const storeSetError = useQuickRecipeStore(state => state.setError);
  const setRecipe = useQuickRecipeStore(state => state.setRecipe);
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id?: string }>();
  const { saveRecipe, isSaving: isSavingRecipe } = useQuickRecipeSave();
  const [debugMode, setDebugMode] = useState(false);
  const { session } = useAuth();
  const recipeId = params.id;
  
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
  
  // Use our new recipe recovery hook
  const { 
    recipeRecoveryStatus,
    attemptRecipeRecovery,
    isValidQuickRecipe,
    storeRecipeWithId,
    getRecipeById,
    ensureRecipeHasId,
    getRecipeIdFromUrl
  } = useRecipeDataRecovery();
  
  // Check if we're resuming from authentication
  const isResuming = location.state?.resumingAfterAuth === true;
  const hasPendingSave = location.state?.pendingSave === true;
  const hasRecipeData = location.state?.recipeData || null;

  // Get recipe ID from URL if available
  useEffect(() => {
    const urlRecipeId = recipeId || getRecipeIdFromUrl();
    
    // Log the current recovery conditions for debugging
    console.log("Recipe recovery conditions:", {
      urlRecipeId,
      recipeId,
      hasRecipeData,
      isResuming,
      hasPendingSave,
      recipeExists: !!recipe
    });
    
    // If we have a recipe ID in the URL but no recipe in the store, 
    // try to load it from localStorage
    if (urlRecipeId && !recipe) {
      const storedRecipe = getRecipeById(urlRecipeId);
      if (storedRecipe) {
        console.log("Restored recipe from ID in URL:", urlRecipeId);
        setRecipe(storedRecipe);
        return;
      }
    }
    
    // If we have recipe data in location state AND we don't have a recipe in the store,
    // restore the recipe and ensure it has an ID
    if (hasRecipeData && !recipe) {
      if (isValidQuickRecipe(hasRecipeData)) {
        console.log("Restoring recipe from location state", hasRecipeData);
        setRecipe(hasRecipeData as QuickRecipe);
        
        // Ensure recipe has ID and update URL if needed
        if (!recipeId) {
          const newId = ensureRecipeHasId(hasRecipeData as QuickRecipe);
          if (newId) {
            // Update URL to include recipe ID without triggering a reload
            navigate(`/recipe-preview/${newId}`, { 
              replace: true, 
              state: location.state 
            });
          }
        }
      }
    } else if (isResuming && !recipe) {
      // If we're resuming after auth but don't have recipe data or a recipe,
      // attempt recovery using our new hook
      const recovered = attemptRecipeRecovery();
      
      if (!recovered) {
        // If recovery failed and we're resuming, we need to handle the failure
        console.warn("Recipe recovery failed after authentication");
        
        // Show a toast notification
        toast.error("We couldn't recover your recipe. Please try again.");
      }
    }
  }, [hasRecipeData, recipe, isResuming, setRecipe, attemptRecipeRecovery, isValidQuickRecipe, 
     recipeId, navigate, location.state, getRecipeById, ensureRecipeHasId, getRecipeIdFromUrl]);

  // Ensure recipe has ID once it's loaded
  useEffect(() => {
    // If we have a recipe but no ID in the URL, generate one and update the URL
    if (recipe && !recipeId) {
      const newId = ensureRecipeHasId(recipe);
      if (newId) {
        console.log("Recipe loaded but no ID in URL, updating URL with ID:", newId);
        navigate(`/recipe-preview/${newId}`, { 
          replace: true, 
          state: location.state 
        });
      }
    }
  }, [recipe, recipeId, ensureRecipeHasId, navigate, location.state]);

  // Handle post-authentication actions
  useEffect(() => {
    const handlePostAuthActions = async () => {
      // Don't proceed if recipe recovery failed
      if (recipeRecoveryStatus === 'failed') {
        return;
      }
      
      // Only proceed if we either have a pending action or we're resuming after auth
      if ((isResuming && hasPendingSave && session) || 
          (isResuming && recipe && session)) {
        
        try {
          // Mark the start of handling auth actions for debugging
          console.log("Processing post-authentication recipe save actions");
          let pendingData;
          
          // First priority: check for action from authStateManager
          const nextAction = authStateManager.getNextPendingAction();
          if (nextAction && nextAction.type === 'save-recipe' && !nextAction.executed) {
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
          
          // If we still don't have recipe data, check current recipe
          if (!pendingData?.recipe && recipe) {
            pendingData = {
              recipe: recipe,
              timestamp: Date.now(),
              sourceUrl: window.location.pathname
            };
            console.log("Using current recipe for save operation");
          }
          
          // Additional fallback - check localStorage
          if (!pendingData?.recipe) {
            const recipeBackup = authStateManager.getRecipeDataFallback();
            if (recipeBackup && recipeBackup.recipe) {
              pendingData = {
                recipe: recipeBackup.recipe,
                timestamp: recipeBackup.timestamp,
                sourceUrl: recipeBackup.sourceUrl
              };
              console.log("Found recipe in localStorage backup");
              
              // Also restore recipe to store if needed
              if (!recipe && isValidQuickRecipe(recipeBackup.recipe)) {
                setRecipe(recipeBackup.recipe as QuickRecipe);
              }
            }
          }
          
          if (pendingData?.recipe && isValidQuickRecipe(pendingData.recipe)) {
            // We have a recipe to save
            toast.loading("Saving your recipe after login...");
            setIsSaving(true);
            
            try {
              const savedData = await saveRecipe(pendingData.recipe as QuickRecipe);
              
              if (savedData && savedData.slug) {
                // Use the centralized state management
                setSaveSuccess(savedData.slug);
                toast.success("Recipe saved successfully!");
                
                // Clear the pending save
                clearPendingRecipe();
                
                // Clear the localStorage backup
                authStateManager.clearRecipeDataFallback();
                
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
  }, [isResuming, hasPendingSave, session, getPendingRecipe, saveRecipe, clearPendingRecipe, 
      setSaveSuccess, setIsSaving, recipe, setRecipe, isValidQuickRecipe, recipeRecoveryStatus]);

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

    // Before attempting to save, ensure recipe has an ID
    const recipeIdToUse = recipeId || ensureRecipeHasId(recipe);

    // Backup recipe to localStorage before attempting to save
    // This ensures we can recover it if auth redirects us away
    if (recipeIdToUse) {
      // Store with specific ID
      storeRecipeWithId(recipe, recipeIdToUse);
      
      // Also backup in authStateManager for legacy support
      authStateManager.storeRecipeDataFallback(recipe);
    } else {
      // Just use the legacy method
      authStateManager.storeRecipeDataFallback(recipe);
    }

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
        
        // Clear the localStorage backup since save was successful
        authStateManager.clearRecipeDataFallback();
        
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
        
        // Make sure auth redirect includes recipe ID
        if (recipeIdToUse) {
          // Store the path with ID for auth redirect
          const currentUrl = `/recipe-preview/${recipeIdToUse}`;
          authStateManager.setRedirectAfterAuth(currentUrl, {
            state: { 
              pendingSave: true,
              resumingAfterAuth: true,
              timestamp: Date.now()
            }
          });
        }
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
  
  // If there's no recipe, check if we need to restore it from localStorage or pending actions
  useEffect(() => {
    if (!recipe && !isLoading && recipeRecoveryStatus !== 'pending') {
      // If recovery already failed, don't try again
      if (recipeRecoveryStatus === 'failed') {
        console.log("Recipe recovery previously failed, not attempting again");
        return;
      }
      
      // Try to recover using our new hook
      const recovered = attemptRecipeRecovery();
      
      // If recovery didn't succeed and we're not resuming from auth,
      // redirect to home
      if (!recovered && !isResuming && !hasPendingSave) {
        console.log("No recipe data available and not resuming, redirecting to home");
        navigate('/', { replace: true });
      }
    }
  }, [recipe, isLoading, isResuming, hasPendingSave, attemptRecipeRecovery, 
      navigate, recipeRecoveryStatus]);
  
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
  
  // Show loading state during recipe recovery
  if (recipeRecoveryStatus === 'pending') {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Recovering recipe data...</p>
        </div>
      </PageContainer>
    );
  }
  
  // Show error state if recovery failed
  if (recipeRecoveryStatus === 'failed' && !recipe) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 space-y-4">
          <div className="rounded-full bg-red-100 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Recipe Recovery Failed</h2>
          <p className="text-gray-600 text-center">We couldn't recover your recipe data after login.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </PageContainer>
    );
  }
  
  // If no recipe, try to render with a loading state instead of redirecting
  if (!recipe) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Loading recipe data...</p>
        </div>
      </PageContainer>
    );
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

import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { PageContainer } from '@/components/ui/containers';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { toast } from 'sonner';
import LoadingOverlay from '@/components/ui/loading-overlay';

const RecipePreviewPage: React.FC = () => {
  const recipe = useQuickRecipeStore(state => state.recipe);
  const formData = useQuickRecipeStore(state => state.formData);
  const isLoading = useQuickRecipeStore(state => state.isLoading);
  const storeSetLoading = useQuickRecipeStore(state => state.setLoading);
  const storeSetError = useQuickRecipeStore(state => state.setError);
  
  const navigate = useNavigate();
  const { saveRecipe, isSaving, savedRecipe } = useQuickRecipeSave();
  const [debugMode, setDebugMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | undefined>(undefined);

  // Reset save success state
  const resetSaveSuccess = useCallback(() => {
    setSaveSuccess(false);
  }, []);

  const handleSaveRecipe = async () => {
    if (!recipe) {
      toast.error("Cannot save: Recipe data is missing");
      return;
    }

    // Set local saving state to true
    setIsSavingLocal(true);

    try {
      // Validate recipe has required fields
      if (!recipe.title || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        toast.error("Cannot save: Recipe is missing required information");
        setIsSavingLocal(false);
        return;
      }

      const savedData = await saveRecipe(recipe);
      
      if (savedData && savedData.id && savedData.slug) {
        setSaveSuccess(true);
        setSavedSlug(savedData.slug);
        
        // Show success toast with 2000ms duration and navigation on dismiss
        toast.success("Recipe saved successfully!", {
          duration: 2000,
          onDismiss: () => {
            navigate(`/recipes/${savedData.slug}`);
          },
          action: {
            label: "View Recipe",
            onClick: () => navigate(`/recipes/${savedData.slug}`)
          }
        });
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
      setIsSavingLocal(false);
    }
  };

  const handleRetry = useCallback(async () => {
    if (formData) {
      storeSetLoading(true);
      try {
        // Retry will go through the loading page
        navigate('/loading', { 
          state: { 
            fromQuickRecipePage: true,
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
  
  // If there's no recipe, redirect to quick-recipe page
  useEffect(() => {
    if (!recipe && !isLoading) {
      console.log("No recipe available, redirecting to quick-recipe");
      navigate('/quick-recipe');
    }
  }, [recipe, isLoading, navigate]);
  
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
  
  // Toggle debug mode function
  const toggleDebugMode = () => setDebugMode(prev => !prev);
  
  const handleBackToForm = () => {
    navigate('/quick-recipe');
  };
  
  // If no recipe, show nothing (will redirect in useEffect)
  if (!recipe) {
    return null;
  }
  
  // Determine if we should show loading overlay (either store saving state or local saving state)
  const showLoadingOverlay = isSaving || isSavingLocal;
  
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
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleBackToForm}
            className="flex items-center gap-2"
            disabled={showLoadingOverlay}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recipe Form
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Your Generated Recipe</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleDebugMode} 
              className="text-xs"
              disabled={showLoadingOverlay}
            >
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </Button>
          </div>
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

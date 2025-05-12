
import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { PageContainer } from '@/components/ui/containers';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQuickRecipeSave } from '@/components/quick-recipe/QuickRecipeSave';
import { toast } from 'sonner';

const RecipePreviewPage: React.FC = () => {
  const recipe = useQuickRecipeStore(state => state.recipe);
  const formData = useQuickRecipeStore(state => state.formData);
  const isLoading = useQuickRecipeStore(state => state.isLoading);
  const storeSetLoading = useQuickRecipeStore(state => state.setLoading);
  const storeSetError = useQuickRecipeStore(state => state.setError);
  
  const navigate = useNavigate();
  const { saveRecipe, isSaving, savedRecipe } = useQuickRecipeSave();

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    try {
      const savedData = await saveRecipe(recipe);
      
      if (savedData) {
        toast.success("Recipe saved successfully!");
        // If we have a recipe ID and slug, we could navigate to the detailed view
        if (savedData.id && savedData.slug) {
          // Optional: navigate to the saved recipe detail page
          // navigate(`/recipes/${savedData.slug}`);
        }
      }
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast.error("Failed to save recipe. Please try again.");
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
  
  const handleBackToForm = () => {
    navigate('/quick-recipe');
  };
  
  // If no recipe, show nothing (will redirect in useEffect)
  if (!recipe) {
    return null;
  }
  
  return (
    <PageContainer>
      <div className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleBackToForm}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recipe Form
          </Button>
          <h1 className="text-2xl font-bold">Your Generated Recipe</h1>
        </div>
      
        <div className="space-y-8">
          <QuickRecipeDisplay 
            recipe={recipe} 
            onSave={handleSaveRecipe}
            isSaving={isSaving}
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

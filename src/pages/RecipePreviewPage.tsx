
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { PageContainer } from '@/components/ui/containers';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const RecipePreviewPage: React.FC = () => {
  const { recipe, formData, isLoading, handleRetry } = useQuickRecipeStore(state => ({
    recipe: state.recipe,
    formData: state.formData,
    isLoading: state.isLoading,
    handleRetry: async () => {
      if (state.formData) {
        state.setLoading(true);
        try {
          // Retry will go through the loading page
          navigate('/loading', { 
            state: { 
              fromQuickRecipePage: true,
              isRetrying: true,
            }
          });
        } catch (err) {
          console.error("Error retrying recipe generation:", err);
          state.setLoading(false);
          state.setError("Failed to retry recipe generation");
        }
      }
    }
  }));
  
  const navigate = useNavigate();
  
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
          <QuickRecipeDisplay recipe={recipe} />
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

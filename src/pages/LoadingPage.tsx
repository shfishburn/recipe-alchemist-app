
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RecipeLoadingAnimation } from '@/components/quick-recipe/loading/RecipeLoadingAnimation';
import { ErrorState } from '@/components/quick-recipe/loading/ErrorState';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface LocationState {
  fromQuickRecipePage?: boolean;
  fromRecipePreview?: boolean;
  error?: string;
  formData?: any;
  timestamp?: number;
}

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState || {};
  
  // Get recipe generation state from the store
  const { 
    recipe, 
    error: storeError,
    isLoading 
  } = useQuickRecipeStore();
  
  // Check if we came from the QuickRecipePage or RecipePreviewPage
  const { 
    fromQuickRecipePage = false, 
    fromRecipePreview = false,
    error = null, 
    formData = null 
  } = state;
  
  // Combine errors from state and store
  const displayError = error || storeError;
  
  // If not coming from QuickRecipePage or RecipePreviewPage, redirect to home
  useEffect(() => {
    if (!fromQuickRecipePage && !fromRecipePreview) {
      navigate('/', { replace: true });
    }
  }, [fromQuickRecipePage, fromRecipePreview, navigate]);
  
  // Handle redirection based on recipe generation state
  useEffect(() => {
    // Log state for debugging
    console.log("LoadingPage - Current state:", {
      recipeExists: !!recipe,
      isLoading,
      displayError
    });
    
    // If there's an error, go back to quick recipe page after showing error
    if (displayError) {
      const timer = setTimeout(() => {
        navigate('/quick-recipe', { 
          state: { 
            error: displayError, 
            formData,
            fromLoading: true
          },
          replace: true 
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    
    // If recipe is ready (not loading and we have recipe data), go to recipe preview page
    if (!isLoading && recipe) {
      console.log("Recipe is ready, navigating to recipe preview page with recipe:", recipe.title);
      navigate('/recipe-preview', { 
        state: { 
          timestamp: Date.now(),
          fromLoading: true,
        },
        replace: true 
      });
      return;
    }
    
    // Auto-redirect if loading takes too long (safety fallback)
    const maxLoadingTime = 45000; // 45 seconds max loading time
    const timeoutId = setTimeout(() => {
      navigate('/quick-recipe', { 
        state: { 
          error: "Recipe generation timed out. Please try again.",
          formData,
          hasTimeoutError: true,
          fromLoading: true
        },
        replace: true 
      });
    }, maxLoadingTime);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [recipe, isLoading, displayError, navigate, formData]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        {displayError ? (
          <ErrorState 
            error={displayError} 
            isRetrying={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <RecipeLoadingAnimation />
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold text-gray-800">Crafting Your Recipe</h2>
              <p className="text-sm text-gray-500">We're creating the perfect recipe with your ingredients...</p>
            </div>
            
            <div className="w-full max-w-xs mt-6">
              <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
                <div className="h-full bg-recipe-green animate-pulse w-full"></div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-2">This may take up to 45 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;

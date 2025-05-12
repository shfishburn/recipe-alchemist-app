
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RecipeLoadingAnimation } from '@/components/quick-recipe/loading/RecipeLoadingAnimation';
import { ErrorState } from '@/components/quick-recipe/loading/ErrorState';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface LocationState {
  fromQuickRecipePage?: boolean;
  fromRecipePreview?: boolean;
  error?: string;
  formData?: Record<string, unknown>; // Fixed the 'any' type with a more specific type
  timestamp?: number;
  isRetrying?: boolean;
}

// Define progress stages for better code organization
interface ProgressStage {
  limit: number;      // Upper limit for this stage
  increment: number;  // How much to increment per interval
  interval: number;   // Milliseconds between updates
  message: string;    // Message to display during this stage
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
  
  // State to track progress animation
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);
  
  // Check if we came from the QuickRecipePage or RecipePreviewPage
  const { 
    fromQuickRecipePage = false, 
    fromRecipePreview = false,
    error = null, 
    formData = null,
    isRetrying = false
  } = state;
  
  // Combine errors from state and store
  const displayError = error || storeError;
  
  // Define progress stages with their properties
  const progressStages: ProgressStage[] = [
    { limit: 20, increment: 3, interval: 600, message: "Gathering recipe ideas..." },        // Stage 0: Initial loading
    { limit: 60, increment: 2, interval: 700, message: "Selecting best ingredients..." },    // Stage 1: Ingredient selection  
    { limit: 85, increment: 1, interval: 1200, message: "Crafting the perfect combination..." }, // Stage 2: Combination crafting
    { limit: 95, increment: 0.5, interval: 1800, message: "Finalizing your recipe..." },     // Stage 3: Finalization
    { limit: 100, increment: 5, interval: 300, message: "Recipe ready!" }                    // Stage 4: Completion
  ];
  
  // If not coming from QuickRecipePage or RecipePreviewPage, redirect to home
  useEffect(() => {
    if (!fromQuickRecipePage && !fromRecipePreview) {
      navigate('/', { replace: true });
    }
  }, [fromQuickRecipePage, fromRecipePreview, navigate]);
  
  // More efficient progressive loading animation using a single interval
  useEffect(() => {
    if (isLoading && !displayError) {
      // Start with a small initial progress
      setProgress(5);
      
      // Current stage tracking
      let currentStageIndex = 0;
      
      // Single interval for all progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Get current stage configuration
          const currentStage = progressStages[currentStageIndex];
          
          // If we're below the limit for current stage
          if (prev < currentStage.limit) {
            // If we're crossing a stage boundary, update the loading stage for message display
            if (currentStageIndex < progressStages.length - 1 && 
                prev + currentStage.increment >= progressStages[currentStageIndex].limit) {
              setLoadingStage(currentStageIndex + 1);
              currentStageIndex++;
            }
            
            // Increase by current stage's increment, but don't exceed the limit
            return Math.min(prev + currentStage.increment, currentStage.limit);
          }
          
          // Move to next stage if available
          if (currentStageIndex < progressStages.length - 1) {
            currentStageIndex++;
            // Get new interval timing for next stage
            clearInterval(progressInterval);
            return prev;
          }
          
          return prev;
        });
      }, progressStages[currentStageIndex].interval);
      
      return () => {
        clearInterval(progressInterval);
      };
    } else if (recipe && !displayError) {
      // Complete the progress bar when recipe is ready
      setProgress(100);
      setLoadingStage(4); // Final stage
    } else if (displayError) {
      // Reset progress when there's an error
      setProgress(0);
    }
  }, [isLoading, recipe, displayError, progressStages]);
  
  // Get loading message based on current stage
  const getLoadingMessage = () => {
    return progressStages[loadingStage]?.message || "Creating your recipe...";
  };
  
  // Handle redirection based on recipe generation state
  useEffect(() => {
    // Log state for debugging
    console.log("LoadingPage - Current state:", {
      recipeExists: !!recipe,
      isLoading,
      displayError,
      progress
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
  }, [recipe, isLoading, displayError, navigate, formData, progress]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        {displayError ? (
          <ErrorState 
            error={displayError} 
            isRetrying={isRetrying}
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <RecipeLoadingAnimation />
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold text-gray-800">Crafting Your Recipe</h2>
              <p 
                className="text-sm text-gray-500"
                aria-live="polite"
              >
                {getLoadingMessage()}
              </p>
            </div>
            
            <div className="w-full max-w-xs mt-6">
              <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
                <div 
                  className="h-full bg-recipe-green transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  aria-label="Recipe generation progress"
                />
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

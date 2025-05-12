import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RecipeLoadingAnimation } from '@/components/quick-recipe/loading/RecipeLoadingAnimation';
import { ErrorState } from '@/components/quick-recipe/loading/ErrorState';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import './loading.css'; // Import the CSS file directly

// Constants
const MAX_LOADING_TIME_MS = 45000; // 45 seconds max loading time
const ERROR_DISPLAY_TIME_MS = 1500; // Time to display error before redirecting

interface LocationState {
  fromQuickRecipePage?: boolean;
  fromRecipePreview?: boolean;
  error?: string;
  formData?: Record<string, unknown>;
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

// Define progress stages outside component to prevent recreation on each render
const PROGRESS_STAGES: ProgressStage[] = [
  { limit: 20, increment: 3, interval: 600, message: "Gathering recipe ideas..." },
  { limit: 60, increment: 2, interval: 700, message: "Selecting best ingredients..." },
  { limit: 85, increment: 1, interval: 1200, message: "Crafting the perfect combination..." },
  { limit: 95, increment: 0.5, interval: 1800, message: "Finalizing your recipe..." },
  { limit: 100, increment: 5, interval: 300, message: "Recipe ready!" }
];

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
  
  // References to store interval and stage index for proper state management
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stageIndexRef = useRef(0);
  const effectRunCountRef = useRef(0);
  
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
  
  // Memoized navigation functions to avoid unnecessary re-renders
  const redirectHome = useCallback(() => {
    if (!fromQuickRecipePage && !fromRecipePreview) {
      navigate('/', { replace: true });
    }
  }, [fromQuickRecipePage, fromRecipePreview, navigate]);
  
  // If not coming from QuickRecipePage or RecipePreviewPage, redirect to home
  useEffect(() => {
    redirectHome();
  }, [redirectHome]);
  
  // Clear any existing interval - extracted as a function for reuse
  const clearProgressInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  // Fixed progressive loading animation with stable refs to avoid re-creating intervals
  useEffect(() => {
    // Track effect runs to debug re-rendering issues
    effectRunCountRef.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Loading progress effect run #${effectRunCountRef.current}`);
    }
    
    // Clean up any existing interval
    clearProgressInterval();
    
    // Only set up interval if we're loading and don't have an error
    if (isLoading && !displayError) {
      // Start with a small initial progress and reset stage
      setProgress(5);
      setLoadingStage(0);
      stageIndexRef.current = 0;
      
      // Single interval function that handles all progress stages internally
      intervalRef.current = setInterval(() => {
        // Get the current stage configuration using the ref to avoid closure issues
        const currentStageIndex = stageIndexRef.current;
        const currentStage = PROGRESS_STAGES[currentStageIndex];
        
        // Use a functional update to ensure we always have the latest progress value
        setProgress(prevProgress => {
          // If we're below the limit for current stage
          if (prevProgress < currentStage.limit) {
            // Check if this update will cross a stage boundary
            const nextProgress = Math.min(prevProgress + currentStage.increment, currentStage.limit);
            
            // If we're reaching the stage limit and there are more stages
            if (nextProgress >= currentStage.limit && currentStageIndex < PROGRESS_STAGES.length - 1) {
              // Prepare for next stage
              const nextStageIndex = currentStageIndex + 1;
              stageIndexRef.current = nextStageIndex;
              setLoadingStage(nextStageIndex);
              
              // Update interval timing for the next stage
              clearProgressInterval();
              intervalRef.current = setInterval(() => {
                // Reuse the same logic but with updated refs
                setProgress(p => {
                  const stageIdx = stageIndexRef.current;
                  const stage = PROGRESS_STAGES[stageIdx];
                  
                  if (p < stage.limit) {
                    const next = Math.min(p + stage.increment, stage.limit);
                    
                    if (next >= stage.limit && stageIdx < PROGRESS_STAGES.length - 1) {
                      // Move to next stage
                      stageIndexRef.current = stageIdx + 1;
                      setLoadingStage(stageIdx + 1);
                      
                      // Recursively update interval for the next stage
                      clearProgressInterval();
                      const nextStage = PROGRESS_STAGES[stageIdx + 1];
                      intervalRef.current = setInterval(
                        // Same callback but we avoid nesting further for clarity
                        () => setProgress(prev => Math.min(prev + nextStage.increment, nextStage.limit)),
                        nextStage.interval
                      );
                    }
                    
                    return next;
                  }
                  
                  return p;
                });
              }, PROGRESS_STAGES[nextStageIndex].interval);
            }
            
            return nextProgress;
          }
          
          return prevProgress;
        });
      }, PROGRESS_STAGES[0].interval);
    } else if (recipe && !displayError) {
      // Complete the progress bar when recipe is ready
      setProgress(100);
      setLoadingStage(4); // Final stage
    } else if (displayError) {
      // Reset progress when there's an error
      setProgress(0);
    }
    
    // Cleanup function to clear interval on unmount or deps change
    return clearProgressInterval;
  }, [isLoading, recipe, displayError, clearProgressInterval]);
  
  // Get loading message based on current stage
  const getLoadingMessage = useCallback(() => {
    return PROGRESS_STAGES[loadingStage]?.message || "Creating your recipe...";
  }, [loadingStage]);
  
  // Memoized navigation handlers
  const navigateToQuickRecipe = useCallback((errorMessage: string, hasTimeoutError = false) => {
    navigate('/quick-recipe', { 
      state: { 
        error: errorMessage, 
        formData,
        hasTimeoutError,
        fromLoading: true
      },
      replace: true 
    });
  }, [navigate, formData]);
  
  const navigateToRecipePreview = useCallback(() => {
    navigate('/recipe-preview', { 
      state: { 
        timestamp: Date.now(),
        fromLoading: true,
      },
      replace: true 
    });
  }, [navigate]);
  
  // Handle redirection based on recipe generation state
  useEffect(() => {
    // Log state for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("LoadingPage - Current state:", {
        recipeExists: !!recipe,
        isLoading,
        displayError,
        progress,
        currentStage: loadingStage,
        effectRuns: effectRunCountRef.current
      });
    }
    
    // If there's an error, go back to quick recipe page after showing error
    if (displayError) {
      const timer = setTimeout(() => {
        navigateToQuickRecipe(displayError);
      }, ERROR_DISPLAY_TIME_MS);
      
      return () => clearTimeout(timer);
    }
    
    // If recipe is ready (not loading and we have recipe data), go to recipe preview page
    if (!isLoading && recipe) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Recipe is ready, navigating to recipe preview page with recipe:", recipe.title);
      }
      navigateToRecipePreview();
      return;
    }
    
    // Auto-redirect if loading takes too long (safety fallback)
    const timeoutId = setTimeout(() => {
      navigateToQuickRecipe("Recipe generation timed out. Please try again.", true);
    }, MAX_LOADING_TIME_MS);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [recipe, isLoading, displayError, navigateToQuickRecipe, navigateToRecipePreview]);
  // ^ Note: progress and loadingStage are intentionally omitted as they're only used in dev logging

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
            <div role="status" aria-label="Recipe is being created">
              <RecipeLoadingAnimation aria-hidden="true" />
            </div>
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
            
            <p className="text-xs text-gray-400 mt-2">This may take up to {MAX_LOADING_TIME_MS/1000} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;

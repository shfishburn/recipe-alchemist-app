
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useTransitionController } from '@/hooks/use-transition-controller';
import { logTransition } from '@/utils/transition-debugger';

// Request queue to prevent multiple simultaneous requests
let isGenerationInProgress = false;

export function useLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    error, 
    recipe, 
    isLoading, 
    formData,
    reset, 
    hasTimeoutError,
    setLoading,
    setError,
    isRecipeValid
  } = useQuickRecipeStore();
  
  const { generateQuickRecipe } = useQuickRecipe();
  
  // Call hooks unconditionally
  const [progress, setProgress] = useState(10);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [animateExit, setAnimateExit] = useState(false);
  const [ready, setReady] = useState(false);
  
  // Simplified transition controller usage
  const { 
    isReady, 
    setIsReady, 
    withBlockedNavigation 
  } = useTransitionController({
    initialReady: false,
    blockByDefault: true,
    debug: true // Enable debugging for transitions
  });
  
  // Set component as ready after a brief delay
  useEffect(() => {
    logTransition('LoadingPage', 'Setting up initial ready state');
    const readyTimer = setTimeout(() => {
      setReady(true);
      setIsReady(true);
      logTransition('LoadingPage', 'Component marked as ready');
    }, 100);
    
    return () => clearTimeout(readyTimer);
  }, [setIsReady]);

  // Handle recipe generation when needed
  useEffect(() => {
    // Check if we have form data and no existing recipe or error
    const shouldGenerateRecipe = formData && isLoading && !recipe && !error && !isGenerationInProgress;
    
    if (shouldGenerateRecipe) {
      const generateRecipe = async () => {
        try {
          isGenerationInProgress = true;
          logTransition('LoadingPage', 'Starting recipe generation');
          
          // Start with min progress of 10%
          setProgress(10);
          
          // Generate the recipe
          const result = await generateQuickRecipe(formData);
          logTransition('LoadingPage', 'Recipe generation completed');
          
          // Set progress to 100% on success
          setProgress(100);
          
          // Allow a small delay for animations to complete
          setTimeout(() => {
            isGenerationInProgress = false;
            logTransition('LoadingPage', 'Generation process complete');
          }, 500);
          
        } catch (err: any) {
          console.error("Recipe generation error in loading page:", err);
          logTransition('LoadingPage', `Generation error: ${err.message || 'Unknown error'}`);
          setError(err.message || "An unexpected error occurred");
          isGenerationInProgress = false;
        }
      };

      generateRecipe();
    }
  }, [formData, isLoading, recipe, error, generateQuickRecipe, setError]);
  
  // Redirect back to quick-recipe if loading is complete or we have a recipe
  useEffect(() => {
    if (!isLoading && recipe && isRecipeValid(recipe) && !animateExit) {
      logTransition('LoadingPage', 'Recipe valid, preparing navigation');
      
      // Set animateExit to trigger exit animation
      setAnimateExit(true);
      
      // Delay navigation to allow for exit animation
      const timeout = setTimeout(() => {
        logTransition('LoadingPage', 'Navigation timeout triggered');
        
        // Force navigation without transition guards for reliability
        navigate('/quick-recipe', { 
          state: { 
            fromLoading: true,
            timestamp: Date.now() // Add timestamp to ensure state is unique
          },
          replace: true // Use replace to avoid back button issues
        });
      }, 400);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, recipe, navigate, isRecipeValid, animateExit]);

  // Handle timeout warning display
  useEffect(() => {
    if (isLoading && !error) {
      // Show timeout warning after 15 seconds
      const timeoutId = setTimeout(() => {
        setShowTimeoutMessage(true);
        logTransition('LoadingPage', 'Displaying timeout message');
      }, 15000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, error]);

  // Simulate progress movement
  useEffect(() => {
    if (isLoading && !error) {
      // Reset progress when loading starts
      setProgress(prev => prev === 100 ? 10 : prev);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          // Progress moves quickly to 60%, then slows down
          if (prev < 60) {
            return Math.min(prev + 5, 60);
          } else {
            return Math.min(prev + 0.5, 95); // Never quite reaches 100%
          }
        });
      }, 750);
      
      return () => clearInterval(interval);
    } else if (recipe && isRecipeValid(recipe)) {
      // Only complete the progress when loading finishes with a valid recipe
      setProgress(100);
    }
  }, [isLoading, error, recipe, isRecipeValid]);

  // Define cancel handler with simplified navigation
  const handleCancel = useCallback(() => {
    logTransition('LoadingPage', 'Cancel requested');
    // Reset state
    reset();
    setAnimateExit(true);
    
    // Simple timeout then navigate approach
    setTimeout(() => {
      logTransition('LoadingPage', 'Navigating after cancel');
      navigate('/', { replace: true });
    }, 400);
  }, [navigate, reset]);

  // Handle retry attempts with simplified error handling
  const handleRetry = useCallback(async () => {
    if (formData && !isGenerationInProgress) {
      logTransition('LoadingPage', 'Retry requested');
      
      try {
        setIsRetrying(true);
        setError(null);
        setLoading(true);
        isGenerationInProgress = true;
        
        // Start a new generation with the existing form data
        await generateQuickRecipe(formData);
        
        isGenerationInProgress = false;
        setIsRetrying(false);
      } catch (error: any) {
        console.error("Error during retry:", error);
        logTransition('LoadingPage', `Retry error: ${error.message || 'Unknown error'}`);
        setIsRetrying(false);
        isGenerationInProgress = false;
        setError(error.message || "An unexpected error occurred during retry");
      }
    } else {
      // If no form data is available, go back to quick recipe page
      logTransition('LoadingPage', 'No form data for retry, returning to recipe page');
      setAnimateExit(true);
      setTimeout(() => {
        navigate('/quick-recipe');
      }, 400);
    }
  }, [formData, generateQuickRecipe, navigate, setError, setLoading]);

  return {
    error,
    progress, 
    showTimeoutMessage,
    isLoading,
    recipe,
    formData,
    hasTimeoutError,
    isRetrying,
    animateExit,
    ready,
    handleCancel,
    handleRetry,
    setAnimateExit
  };
}

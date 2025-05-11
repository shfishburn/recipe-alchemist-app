
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useTransitionController } from '@/hooks/use-transition-controller';

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
  
  // Use transition controller for coordinated animations
  const { isReady, setIsReady, withBlockedNavigation } = useTransitionController({
    initialReady: false,
    blockByDefault: true
  });
  
  // Set component as ready after a brief delay
  useEffect(() => {
    const readyTimer = setTimeout(() => {
      setReady(true);
      setIsReady(true);
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
          console.log("Starting recipe generation from Loading Page");
          
          // Start with min progress of 10%
          setProgress(10);
          
          // Generate the recipe
          const result = await generateQuickRecipe(formData);
          
          // Set progress to 100% on success
          setProgress(100);
          
          // Allow a small delay for animations to complete
          setTimeout(() => {
            isGenerationInProgress = false;
          }, 500);
          
        } catch (err: any) {
          console.error("Recipe generation error in loading page:", err);
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
      console.log("Loading complete, recipe valid, preparing for navigation");
      
      // Set animateExit to trigger exit animation
      setAnimateExit(true);
      
      // Delay navigation to allow for exit animation
      const timeout = setTimeout(() => {
        console.log("Navigation timeout triggered, navigating to /quick-recipe");
        navigate('/quick-recipe', { state: { fromLoading: true } });
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

  // Define cancel handler that will reset state and navigate home
  const handleCancel = useCallback(() => {
    withBlockedNavigation(async () => {
      reset();
      // Set animateExit to true to trigger exit animation
      setAnimateExit(true);
      
      // Delay navigation to allow for exit animation
      await new Promise(resolve => setTimeout(resolve, 400));
      navigate('/', { replace: true });
      return true;
    });
  }, [navigate, reset, withBlockedNavigation]);

  // Handle retry attempts with improved error handling
  const handleRetry = useCallback(async () => {
    if (formData && !isGenerationInProgress) {
      await withBlockedNavigation(async () => {
        try {
          setIsRetrying(true);
          setError(null);
          setLoading(true);
          isGenerationInProgress = true;
          
          console.log("Retrying recipe generation with formData:", formData);
          
          // Start a new generation with the existing form data
          await generateQuickRecipe(formData);
          
          isGenerationInProgress = false;
          setIsRetrying(false);
          return true;
        } catch (error: any) {
          console.error("Error during retry:", error);
          setIsRetrying(false);
          isGenerationInProgress = false;
          setError(error.message || "An unexpected error occurred during retry");
          return false;
        }
      });
    } else {
      // If no form data is available, go back to quick recipe page
      withBlockedNavigation(async () => {
        setAnimateExit(true);
        await new Promise(resolve => setTimeout(resolve, 400));
        navigate('/quick-recipe');
        return true;
      });
    }
  }, [formData, generateQuickRecipe, navigate, setError, setLoading, withBlockedNavigation]);

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

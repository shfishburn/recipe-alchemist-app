
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';

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
  
  // Ensuring all hooks are called unconditionally
  const [progress, setProgress] = useState(10);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [animateExit, setAnimateExit] = useState(false);
  const [ready, setReady] = useState(true);
  
  // Redirect back to quick-recipe if loading is complete or we have a recipe
  useEffect(() => {
    if (!isLoading && recipe && isRecipeValid(recipe)) {
      console.log("Loading complete, recipe valid, preparing for navigation");
      
      // Set animateExit to true to trigger exit animation
      setAnimateExit(true);
      
      // Delay navigation to allow for exit animation
      const timeout = setTimeout(() => {
        console.log("Navigation timeout triggered, navigating to /quick-recipe");
        navigate('/quick-recipe', { state: { fromLoading: true } });
      }, 400); // Increased from 200ms to 400ms for smoother transitions
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, recipe, navigate, isRecipeValid]);

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
      setProgress(10);
      
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
    reset();
    // Set animateExit to true to trigger exit animation
    setAnimateExit(true);
    
    // Delay navigation to allow for exit animation
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 400); // Increased from 200ms to 400ms
  }, [navigate, reset]);

  // Handle retry attempts with improved error handling
  const handleRetry = useCallback(async () => {
    if (formData) {
      try {
        setIsRetrying(true);
        setError(null);
        setLoading(true);
        
        console.log("Retrying recipe generation with formData:", formData);
        
        // Start a new generation with the existing form data
        await generateQuickRecipe(formData);
        
        setIsRetrying(false);
      } catch (error: any) {
        console.error("Error during retry:", error);
        setIsRetrying(false);
        setError(error.message || "An unexpected error occurred during retry");
      }
    } else {
      // If no form data is available, go back to quick recipe page
      setAnimateExit(true);
      setTimeout(() => {
        navigate('/quick-recipe');
      }, 400); // Increased from 200ms to 400ms
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

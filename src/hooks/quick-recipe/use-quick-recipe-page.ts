
import { useState, useEffect, useCallback } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useAuth } from '@/hooks/use-auth';
import { useAbortController } from './use-abort-controller';
import { useRecipeRetry } from './use-recipe-retry';
import { useRecipeNavigation } from './use-recipe-navigation';
import { useSessionStorage } from './use-session-storage';

export function useQuickRecipePage() {
  // Get state and actions from store
  const { 
    recipe, 
    isLoading, 
    formData, 
    error, 
    reset, 
    setFormData, 
    setLoading, 
    hasTimeoutError, 
    setError,
    setNavigate,
    updateLoadingState
  } = useQuickRecipeStore();
  
  // Get utilities from custom hooks
  const { generateQuickRecipe } = useQuickRecipe();
  const { session } = useAuth();
  const [debugMode, setDebugMode] = useState(false);
  const { abortControllerRef, createAbortController, cleanupRequestState } = useAbortController();
  const { isRetrying, handleRetry: retryGeneration } = useRecipeRetry();
  const { navigate, handleCancel } = useRecipeNavigation();
  const { location, saveGenerationData, getGenerationData, clearGenerationData } = useSessionStorage();
  
  // Check if we're navigating from navbar (no state)
  const isDirectNavigation = !location.state;
  
  // Store navigate function in the global store for use in other components
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanupRequestState();
    };
  }, [cleanupRequestState]);

  // Check if we need to resume recipe generation after login
  useEffect(() => {
    if (session) {
      const generationData = getGenerationData();
      
      if (generationData && !isLoading && !recipe) {
        if (generationData.formData) {
          console.log("Resuming recipe generation after login:", generationData);
          // Clear the stored data
          clearGenerationData();
          
          // Start the generation process
          setLoading(true);
          setFormData(generationData.formData);
          
          // Create a new abort controller
          const controller = createAbortController();
          
          // Add a timeout to prevent UI lockup
          setTimeout(() => {
            // Start an async generation with abort signal
            generateQuickRecipe(generationData.formData, { signal: controller.signal, timeout: 40000 })
              .catch(err => {
                // Don't show error if aborted
                if (err.name === 'AbortError') {
                  console.log("Recipe generation aborted");
                  return;
                }
                
                console.error("Error resuming recipe generation:", err);
                toast({
                  title: "Recipe generation failed",
                  description: err.message || "Please try again later.",
                  variant: "destructive",
                });
              });
          }, 100);
        }
      }
    }
  }, [session, isLoading, recipe, generateQuickRecipe, setLoading, setFormData, createAbortController, getGenerationData, clearGenerationData]);

  // Reset loading state if navigating directly from navbar
  useEffect(() => {
    if (isDirectNavigation && isLoading) {
      console.log("Direct navigation detected while loading, resetting state");
      handleCancel();
    }
  }, [isDirectNavigation, isLoading, handleCancel]);

  // Only redirect if not loading AND no recipe data AND no error AND no formData
  useEffect(() => {
    if (!isLoading && !recipe && !error && !formData && !isDirectNavigation) {
      console.log("No recipe data available, redirecting to home");
      navigate('/');
    }
  }, [isLoading, recipe, error, formData, navigate, isDirectNavigation]);

  // Wrapper for retry function with appropriate parameters
  const handleRetry = useCallback(() => {
    return retryGeneration(formData, createAbortController);
  }, [formData, retryGeneration, createAbortController]);

  // Toggle debug mode
  const toggleDebugMode = useCallback(() => {
    setDebugMode(!debugMode);
  }, [debugMode]);

  return {
    recipe,
    isLoading,
    formData,
    error,
    hasTimeoutError,
    isRetrying,
    debugMode,
    isDirectNavigation,
    handleRetry,
    handleCancel,
    toggleDebugMode,
    abortControllerRef
  };
}

// Add missing import that was automatically inferred
import { toast } from '@/hooks/use-toast';

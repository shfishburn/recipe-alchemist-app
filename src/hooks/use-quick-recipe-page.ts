
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

export function useQuickRecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { recipe, isLoading, formData, error, reset, setFormData, setLoading, hasTimeoutError, setError } = useQuickRecipeStore();
  const { generateQuickRecipe } = useQuickRecipe();
  const { session } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Check if we're navigating from navbar (no state)
  const isDirectNavigation = !location.state;
  
  // Function to create a new abort controller
  const createAbortController = useCallback(() => {
    // Clean up any existing controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Create a new controller
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  // Cleanup function
  const cleanupRequestState = useCallback(() => {
    // Abort any pending requests on unmount
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanupRequestState();
    };
  }, [cleanupRequestState]);

  // Check if we need to resume recipe generation after login
  useEffect(() => {
    if (session) {
      const storedGenerationData = sessionStorage.getItem('recipeGenerationSource');
      if (storedGenerationData && !isLoading && !recipe) {
        try {
          const parsedData = JSON.parse(storedGenerationData);
          if (parsedData.formData) {
            console.log("Resuming recipe generation after login:", parsedData);
            // Clear the stored data
            sessionStorage.removeItem('recipeGenerationSource');
            
            // Start the generation process
            setLoading(true);
            setFormData(parsedData.formData);
            
            // Create a new abort controller
            const controller = createAbortController();
            
            // Start an async generation with abort signal
            generateQuickRecipe(parsedData.formData, { signal: controller.signal })
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
          }
        } catch (err) {
          console.error("Error parsing stored recipe data:", err);
        }
      }
    }
  }, [session, isLoading, recipe, generateQuickRecipe, setLoading, setFormData, createAbortController]);

  // Reset loading state if navigating directly from navbar
  useEffect(() => {
    if (isDirectNavigation && isLoading) {
      console.log("Direct navigation detected while loading, resetting state");
      handleCancel();
    }
  }, [isDirectNavigation, isLoading]);

  // Only redirect if not loading AND no recipe data AND no error AND no formData
  useEffect(() => {
    if (!isLoading && !recipe && !error && !formData && !isDirectNavigation) {
      console.log("No recipe data available, redirecting to home");
      navigate('/');
    }
  }, [isLoading, recipe, error, formData, navigate, isDirectNavigation]);

  const handleRetry = useCallback(async () => {
    if (formData) {
      try {
        setIsRetrying(true);
        console.log("Retrying recipe generation with formData:", formData);
        
        // Clear any existing errors
        setError(null);
        
        // Start the recipe generation with proper loading state
        setLoading(true);
        
        toast({
          title: "Retrying recipe generation",
          description: "We're attempting to generate your recipe again...",
        });
        
        // Create a new abort controller for this request
        const controller = createAbortController();
        
        // Start the recipe generation immediately with abort signal
        await generateQuickRecipe(formData, { signal: controller.signal });
        
        setIsRetrying(false);
      } catch (err: any) {
        // Don't show error if aborted
        if (err.name === 'AbortError') {
          console.log("Recipe generation retry aborted");
          setIsRetrying(false);
          return;
        }
        
        console.error("Error retrying recipe generation:", err);
        setIsRetrying(false);
        toast({
          title: "Recipe generation failed",
          description: err.message || "Please try again later.",
          variant: "destructive",
        });
      }
    }
  }, [formData, setError, setLoading, createAbortController, generateQuickRecipe]);

  const handleCancel = useCallback(() => {
    // Abort any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Reset the store state
    reset();
    
    // Stop retrying if in progress
    setIsRetrying(false);
    
    // Navigate back to home
    navigate('/');
    
    // Show toast informing the user
    toast({
      title: "Recipe generation cancelled",
      description: "You can try again with new ingredients anytime.",
    });
  }, [reset, navigate]);

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
    toggleDebugMode
  };
}

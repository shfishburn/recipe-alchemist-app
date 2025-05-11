
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

export function useQuickRecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
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
    setRecipe 
  } = useQuickRecipeStore();
  const { generateQuickRecipe } = useQuickRecipe();
  const { session } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  // Check if we're navigating from navbar (no state)
  const isDirectNavigation = !location.state;
  
  // Check if we're resuming a recipe generation after login
  const isResumingGeneration = location.state?.resumingGeneration || false;
  
  // Check if we need to resume recipe generation after login
  useEffect(() => {
    const handleRecipeResumption = async () => {
      // Case 1: Check for recipe data in location state (coming from Auth redirect)
      if (location.state?.recipeData && !isLoading && !recipe) {
        const recipeData = location.state.recipeData;
        
        console.log("Resuming recipe generation from location state:", recipeData);
        
        try {
          if (recipeData.formData) {
            // Start the generation process
            setLoading(true);
            setFormData(recipeData.formData);
            setError(null); // Clear any previous errors
            
            // Start an async generation
            await generateQuickRecipe(recipeData.formData);
          } else if (recipeData.recipe) {
            // We already have a generated recipe, just display it
            console.log("Using already generated recipe from location state");
            setRecipe(recipeData.recipe);
          }
        } catch (err) {
          console.error("Error resuming recipe generation from location state:", err);
          setError(err.message || "Failed to resume recipe generation. Please try again.");
          setLoading(false);
        }
        
        return;
      }
      
      // Case 2: Check for recipe data in session storage (after login)
      if (session) {
        const storedGenerationData = sessionStorage.getItem('recipeGenerationSource');
        if (storedGenerationData && !isLoading && !recipe) {
          try {
            const parsedData = JSON.parse(storedGenerationData);
            if (parsedData.formData) {
              console.log("Resuming recipe generation after login from session storage:", parsedData);
              
              // Clear the stored data after retrieving it
              sessionStorage.removeItem('recipeGenerationSource');
              
              // Set loading state and form data
              setLoading(true);
              setFormData(parsedData.formData);
              setError(null); // Clear any previous errors
              
              try {
                // Start an async generation
                await generateQuickRecipe(parsedData.formData);
              } catch (err) {
                console.error("Error resuming recipe generation from session storage:", err);
                setError(err.message || "Failed to resume recipe generation. Please try again.");
                setLoading(false);
              }
            }
          } catch (err) {
            console.error("Error parsing stored recipe data:", err);
            sessionStorage.removeItem('recipeGenerationSource');
          }
        }
      }
    };
    
    // Only attempt to resume if we're not already loading and either:
    // 1. We have location state with recipeData, or
    // 2. We're authenticated and have stored recipe data
    if (!isLoading && (location.state?.recipeData || (session && sessionStorage.getItem('recipeGenerationSource')))) {
      handleRecipeResumption();
    }
  }, [session, isLoading, recipe, generateQuickRecipe, setLoading, setFormData, setRecipe, setError, location.state]);

  // Reset loading state if navigating directly from navbar
  useEffect(() => {
    if (isDirectNavigation && isLoading && !isResumingGeneration) {
      console.log("Direct navigation detected while loading, resetting state");
      reset();
    }
  }, [isDirectNavigation, isLoading, reset, isResumingGeneration]);

  // Only redirect if NOT direct navigation AND not loading AND no recipe AND no error AND no form data
  // MODIFIED: Less aggressive redirection logic
  useEffect(() => {
    const shouldRedirect = !isDirectNavigation && 
                           !isLoading && 
                           !isResumingGeneration && 
                           !recipe && 
                           !formData && 
                           !error;
    
    if (shouldRedirect) {
      console.log("No recipe data available, redirecting to home");
      navigate('/');
    }
  }, [isLoading, recipe, error, formData, navigate, isDirectNavigation, isResumingGeneration]);

  const handleRetry = async () => {
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
        
        // Start the recipe generation immediately
        await generateQuickRecipe(formData);
        
        setIsRetrying(false);
      } catch (err) {
        console.error("Error retrying recipe generation:", err);
        setIsRetrying(false);
        setLoading(false);
        toast({
          title: "Recipe generation failed",
          description: err.message || "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    // Reset and navigate back to home
    reset();
    navigate('/');
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return {
    recipe,
    isLoading,
    formData,
    error,
    hasTimeoutError,
    isRetrying,
    debugMode,
    isDirectNavigation,
    isResumingGeneration,
    handleRetry,
    handleCancel,
    toggleDebugMode
  };
}

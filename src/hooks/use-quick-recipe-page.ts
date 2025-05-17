
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
  
  // Check if we're coming from the loading page
  const isFromLoadingPage = location.state?.fromLoading === true;
  
  // More accurately determine if this is a direct navigation
  const isDirectNavigation = !isFromLoadingPage && 
                            !location.state?.fromForm && 
                            !recipe;
  
  // Check if we're resuming a recipe generation after login
  const isResumingGeneration = location.state?.resumingGeneration || false;
  
  // Log navigation state for debugging
  useEffect(() => {
    console.log("QuickRecipePage navigation state:", {
      isFromLoadingPage,
      isDirectNavigation,
      hasRecipe: !!recipe,
      locationState: location.state || 'no state',
      formData: !!formData
    });
  }, [isFromLoadingPage, isDirectNavigation, recipe, location.state, formData]);
  
  // Check if we need to resume recipe generation after login
  useEffect(() => {
    const handleRecipeResumption = async () => {
      // Case 1: Check for recipe data in location state (coming from Auth redirect)
      if (location.state?.recipeData && !isLoading && !recipe) {
        const recipeData = location.state.recipeData;
        
        console.log("Resuming recipe generation from location state:", recipeData);
        
        try {
          if (recipeData.formData) {
            // Set the form data and navigate to loading page
            setFormData(recipeData.formData);
            setError(null); // Clear any previous errors
            
            // Navigate to loading page and generate recipe from there
            navigate('/loading', { 
              state: { 
                fromQuickRecipePage: true,
                resumingGeneration: true
              },
              replace: true
            });
            
            // Loading page will handle starting the generation
            setLoading(true);
            
            // Start an async generation
            try {
              // Make sure dietary is always present, even if empty array
              const processedFormData = {
                ...recipeData.formData,
                dietary: recipeData.formData.dietary || [],
              };
              
              await generateQuickRecipe(processedFormData);
            } catch (e: unknown) {
              const message = e instanceof Error ? e.message : "Failed to resume recipe generation. Please try again.";
              console.error("Error resuming recipe generation from location state:", e);
              setError(message);
              setLoading(false);
            }
          } else if (recipeData.recipe) {
            // We already have a generated recipe in location.state
            // Only set it if it's not already the current recipe in the store,
            // or if the store's recipe is null/undefined.
            // Assuming recipes have a unique 'id' property.
            if (!recipe || (recipe && recipeData.recipe.id !== recipe.id)) {
              console.log("Setting/updating recipe from location state:", recipeData.recipe.title);
              setRecipe(recipeData.recipe);
            } else {
              console.log("Recipe from location state is same as current store recipe or already set, not re-setting.");
            }
          }
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Failed to resume recipe generation. Please try again.";
          console.error("Error resuming recipe generation from location state:", e);
          setError(message);
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
              
              // Set form data and navigate to loading page
              setFormData(parsedData.formData);
              setError(null); // Clear any previous errors
              
              // Navigate to loading page and generate recipe from there
              navigate('/loading', { 
                state: { 
                  fromQuickRecipePage: true,
                  resumingGeneration: true
                }, 
                replace: true
              });
              
              // Loading page will handle setting loading state
              setLoading(true);
              
              try {
                // Start an async generation
                // Ensure dietary is always present
                const processedFormData = {
                  ...parsedData.formData,
                  dietary: parsedData.formData.dietary || [],
                };
                
                await generateQuickRecipe(processedFormData);
              } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to resume recipe generation. Please try again.";
                console.error("Error resuming recipe generation from session storage:", e);
                setError(message);
                setLoading(false);
              }
            }
          } catch (e: unknown) {
            // For this catch, only console.error was used, so direct usage of 'e' is fine.
            // If err.message were used, we'd need to process 'e' as above.
            console.error("Error parsing stored recipe data:", e);
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
  }, [session, isLoading, recipe, generateQuickRecipe, setLoading, setFormData, setRecipe, setError, location.state, navigate]);

  // Reset loading state if navigating directly from navbar
  useEffect(() => {
    if (isDirectNavigation && isLoading && !isResumingGeneration) {
      console.log("Direct navigation detected while loading, resetting state");
      reset();
    }
  }, [isDirectNavigation, isLoading, reset, isResumingGeneration]);

  // Only redirect if NOT direct navigation AND not loading AND no recipe AND no error AND no form data
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
        
        // Set loading state and navigate to loading page
        setLoading(true);
        
        toast({
          title: "Retrying recipe generation",
          description: "We're attempting to generate your recipe again...",
        });
        
        // Navigate to loading page for the retry
        navigate('/loading', { 
          state: { 
            fromQuickRecipePage: true,
            isRetrying: true,
          },
          replace: true
        });
        
        // Start the recipe generation
        // Ensure dietary is always present, even if empty array
        const processedFormData = {
          ...formData,
          dietary: formData.dietary || [],
        };
        
        await generateQuickRecipe(processedFormData);
        
        setIsRetrying(false);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Please try again later.";
        console.error("Error retrying recipe generation:", e);
        setIsRetrying(false);
        setLoading(false);
        toast({
          title: "Recipe generation failed",
          description: message,
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

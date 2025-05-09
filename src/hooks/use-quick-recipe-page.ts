
import { useState, useEffect } from 'react';
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
  
  // Check if we're navigating from navbar (no state)
  const isDirectNavigation = !location.state && !location.state?.recipeData;

  // Check if we need to resume recipe generation after login
  useEffect(() => {
    // Check for recipe data in location state (coming from Auth redirect)
    if (location.state?.recipeData && !isLoading && !recipe) {
      const recipeData = location.state.recipeData;
      
      console.log("Resuming recipe generation from location state:", recipeData);
      
      if (recipeData.formData) {
        // Start the generation process
        setLoading(true);
        setFormData(recipeData.formData);
        
        // Start an async generation
        generateQuickRecipe(recipeData.formData).catch(err => {
          console.error("Error resuming recipe generation:", err);
          toast({
            title: "Recipe generation failed",
            description: err.message || "Please try again later.",
            variant: "destructive",
          });
        });
      }
      
      return;
    }
    
    // Check for recipe data in session storage (after login)
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
            
            // Start an async generation
            generateQuickRecipe(parsedData.formData).catch(err => {
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
  }, [session, isLoading, recipe, generateQuickRecipe, setLoading, setFormData, location.state]);

  // Reset loading state if navigating directly from navbar
  useEffect(() => {
    if (isDirectNavigation && isLoading) {
      console.log("Direct navigation detected while loading, resetting state");
      reset();
    }
  }, [isDirectNavigation, isLoading, reset]);

  // Only redirect if not loading AND no recipe data AND no error AND no formData
  useEffect(() => {
    if (!isLoading && !recipe && !error && !formData && !isDirectNavigation) {
      console.log("No recipe data available, redirecting to home");
      navigate('/');
    }
  }, [isLoading, recipe, error, formData, navigate, isDirectNavigation]);

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
      } catch (err: any) {
        console.error("Error retrying recipe generation:", err);
        setIsRetrying(false);
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
    handleRetry,
    handleCancel,
    toggleDebugMode
  };
}

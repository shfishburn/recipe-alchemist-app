
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function useQuickRecipeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const { 
    reset, 
    recipe, 
    setLoading, 
    setRecipe, 
    setFormData, 
    setError,
    setNavigate,
    isRecipeValid,
    setHasTimeoutError,
    updateLoadingState
  } = useQuickRecipeStore();
  
  // Store navigate function in the global store for use in other components
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (formData: QuickRecipeFormData) => {
    try {
      console.log("useQuickRecipeForm - Handling form submission with data:", formData);
      
      // Validate that we have ingredients, which is required by the API
      if (!formData.mainIngredient || (typeof formData.mainIngredient === 'string' && formData.mainIngredient.trim() === '')) {
        toast({
          title: "Missing ingredient",
          description: "Please enter at least one main ingredient",
          variant: "destructive",
        });
        return null;
      }
      
      // Ensure cuisine has a valid value - never undefined or null
      const processedFormData = {
        ...formData,
        cuisine: Array.isArray(formData.cuisine) ? formData.cuisine : 
                (formData.cuisine ? [formData.cuisine] : ['any']), // Ensure it's an array with at least 'any'
        dietary: Array.isArray(formData.dietary) ? formData.dietary : 
                (formData.dietary ? [formData.dietary] : [])  // Ensure it's an array
      };

      console.log("Processed form data:", processedFormData);
      
      // Reset any previous state
      reset();
      
      // Set loading state immediately so it shows the loading animation
      setLoading(true);
      setFormData(processedFormData);
      
      // Initialize loading state with estimated time
      updateLoadingState({
        step: 0,
        stepDescription: "Analyzing your ingredients...",
        percentComplete: 0,
        estimatedTimeRemaining: 30
      });
      
      // Log in console instead of showing non-error toast
      console.log("Creating your recipe - processing request...");
      
      // Save current path and form data to session storage in case user needs to log in
      // This will allow us to resume the recipe generation after login
      sessionStorage.setItem('recipeGenerationSource', JSON.stringify({
        path: location.pathname,
        formData: processedFormData
      }));
      
      // Navigate to the loading page
      navigate('/loading', { 
        state: { 
          timestamp: Date.now(),
          formData: processedFormData // Explicitly pass formData in navigation state
        }
      });
      
      // Return the processed form data
      return processedFormData;
      
    } catch (error: any) {
      console.error('Error submitting quick recipe form:', error);
      setLoading(false);
      setError(error.message || "Failed to submit recipe request. Please try again.");
      
      // Retain form data on error
      const errorMessage = error.message || "Failed to submit recipe request. Please try again.";
      
      // Navigate back to home page with error but retain form data
      navigate('/', {
        state: { 
          error: errorMessage,
          formData: formData // Keep the form data on error
        },
        replace: true
      });
      
      return null;
    }
  }, [navigate, reset, setLoading, setFormData, setRecipe, setError, location.pathname, updateLoadingState]);

  return {
    handleSubmit,
    navigate,
    location,
    reset,
    recipe
  };
}

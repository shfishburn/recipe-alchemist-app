
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { authStateManager } from '@/lib/auth/auth-state-manager';

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
      
      // Reset any previous state
      reset();
      
      // Set loading state immediately so it shows the loading animation
      setLoading(true);
      setFormData(formData);
      
      // Initialize loading state with estimated time
      updateLoadingState({
        step: 0,
        stepDescription: "Analyzing your ingredients...",
        percentComplete: 0,
        estimatedTimeRemaining: 30
      });
      
      console.log("Creating your recipe - processing request...");
      
      // If user is not authenticated, store the generation data for resumption
      if (!session) {
        authStateManager.queueAction({
          type: 'generate-recipe',
          data: { formData },
          sourceUrl: location.pathname
        });
      }
      
      // Navigate to the loading page
      navigate('/loading', { 
        state: { 
          timestamp: Date.now(),
          formData // Explicitly pass formData in navigation state
        }
      });
      
      // Return the processed form data
      return formData;
      
    } catch (error: unknown) {
      console.error('Error submitting quick recipe form:', error);
      setLoading(false);
      
      // Improved error handling with type narrowing
      let errorMessage = "Failed to submit recipe request. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Detailed error information:', { message: error.message, stack: error.stack });
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    }
  }, [navigate, reset, setLoading, setFormData, setError, location.pathname, updateLoadingState, session]);

  return {
    handleSubmit,
    navigate,
    location,
    reset,
    recipe
  };
}

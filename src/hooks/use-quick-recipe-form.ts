
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useTransitionController } from '@/hooks/use-transition-controller';

// Prevent multiple simultaneous submissions
let isSubmitting = false;

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
  
  // Use transition controller for smoother transitions
  const { withDelayedTransition } = useTransitionController();
  
  // Store navigate function in the global store for use in other components
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);
  
  // Normalize and enhance error messages for better user feedback
  const normalizeErrorMessage = useCallback((error: any): string => {
    if (!error) return "An unknown error occurred";
    
    const message = typeof error === 'string' ? error : error.message || "An unknown error occurred";
    
    if (message.toLowerCase().includes('timeout')) {
      setHasTimeoutError(true);
      return "Recipe generation timed out. Please try again with a simpler recipe request.";
    }
    
    if (message.toLowerCase().includes('network') || message.toLowerCase().includes('connection')) {
      return "Network error while generating recipe. Please check your internet connection and try again.";
    }
    
    if (message.toLowerCase().includes('openai')) {
      console.error("CRITICAL: OpenAI API issue detected");
      return "There's an issue with our AI service. Our team has been notified.";
    }
    
    return message;
  }, [setHasTimeoutError]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (formData: QuickRecipeFormData) => {
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Submission already in progress, ignoring request");
      return null;
    }
    
    try {
      isSubmitting = true;
      console.log("useQuickRecipeForm - Handling form submission with data:", formData);
      
      // Validate that we have mainIngredient, which is required by the API
      if (!formData.mainIngredient || (typeof formData.mainIngredient === 'string' && formData.mainIngredient.trim() === '')) {
        toast({
          title: "Missing ingredient",
          description: "Please enter at least one main ingredient",
          variant: "destructive",
        });
        isSubmitting = false;
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
      
      await withDelayedTransition(async () => {
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
      });
      
      // Navigate to the loading page AFTER transition is complete
      navigate('/loading', { 
        state: { 
          fromForm: true, 
          timestamp: Date.now()
        }
      });
      
      // The loading page will handle starting the recipe generation
      return processedFormData;
    } catch (error: any) {
      console.error('Error submitting quick recipe form:', error);
      setLoading(false);
      
      const errorMessage = normalizeErrorMessage(error);
      setError(errorMessage);
      
      toast({
        title: "Recipe generation failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      isSubmitting = false;
      return null;
    } finally {
      // Reset submitting state after a delay to prevent immediate resubmissions
      setTimeout(() => {
        isSubmitting = false;
      }, 1000);
    }
  }, [navigate, reset, setLoading, setFormData, setRecipe, setError, location.pathname, normalizeErrorMessage, updateLoadingState, withDelayedTransition]);

  return {
    handleSubmit,
    navigate,
    location,
    reset,
    recipe
  };
}

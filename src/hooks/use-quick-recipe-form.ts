
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
      console.log("Handling form submission with data:", formData);
      
      // Validate that we have mainIngredient, which is required by the API
      if (!formData.mainIngredient || formData.mainIngredient.trim() === '') {
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
        cuisine: formData.cuisine || 'any', // Default to 'any' if not provided
        dietary: formData.dietary || ''  // Default to empty string if not provided
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
      
      // Navigate to the quick recipe page BEFORE starting the API call
      // This ensures the loading animation is displayed
      navigate('/quick-recipe', { 
        state: { fromForm: true, timestamp: Date.now() }
      });
      
      // Start generating the recipe immediately after navigation
      try {
        console.log("Starting recipe generation with payload:", {
          cuisine: processedFormData.cuisine,
          dietary: processedFormData.dietary,
          mainIngredient: processedFormData.mainIngredient,
          servings: processedFormData.servings || 2 // Ensure servings has a default value
        });
        
        // Add a small delay to ensure navigation completes
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Generate the recipe - authentication check removed
        const generatedRecipe = await generateQuickRecipe(processedFormData);
        
        // Validate the recipe structure before setting it
        if (!isRecipeValid(generatedRecipe)) {
          throw new Error("The recipe format returned from the API was invalid. Please try again.");
        }
        
        // Ensure recipe has valid cuisine value
        if (!generatedRecipe.cuisine || generatedRecipe.cuisine.trim() === '') {
          console.log("Setting default cuisine for recipe as it was missing");
          generatedRecipe.cuisine = "any";
        }
        
        console.log("Recipe generation successful:", generatedRecipe);
        setRecipe(generatedRecipe);
        
        // Success message in console instead of toast
        console.log("Recipe created successfully!");
        
        return generatedRecipe;
      } catch (error: any) {
        console.error('Error generating recipe:', error);
        setLoading(false);
        
        // More specific error message based on the error type
        let errorMessage = error.message || "Failed to generate recipe. Please try again.";
        let isTimeout = false;
        
        if (error.message?.includes('timeout')) {
          errorMessage = "Recipe generation timed out. Please try again with a simpler recipe request.";
          isTimeout = true;
          setHasTimeoutError(true);
        } else if (error.status === 400) {
          errorMessage = "Invalid recipe request. Please check your inputs and try again.";
        } else if (error.message?.includes('Edge Function')) {
          errorMessage = "We're having trouble connecting to our recipe service. Please try again shortly.";
        } else if (error.message?.includes('OpenAI API key')) {
          errorMessage = "There's an issue with our AI service configuration. Our team has been notified.";
          // Log specifically for API key issues
          console.error("CRITICAL: OpenAI API key issue detected");
        } else if (error.message?.includes('Empty request body')) {
          errorMessage = "The recipe request couldn't be sent correctly. Please try again.";
          console.error("CRITICAL: Empty request body detected");
        }
        
        // Set descriptive error with timeout flag
        setError(errorMessage);
        
        // Keep error toast only
        toast({
          title: "Recipe generation failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        return null;
      }
    } catch (error: any) {
      console.error('Error submitting quick recipe form:', error);
      setLoading(false);
      setError(error.message || "Failed to submit recipe request. Please try again.");
      return null;
    }
  }, [navigate, reset, setLoading, setFormData, setRecipe, setError, isRecipeValid, location.pathname, setHasTimeoutError, updateLoadingState]);

  return {
    handleSubmit,
    navigate,
    location,
    reset,
    recipe
  };
}

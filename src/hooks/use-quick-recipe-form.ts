import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { toast } from '@/hooks/use-toast';

export function useQuickRecipeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    reset, 
    recipe, 
    setLoading, 
    setRecipe, 
    setFormData, 
    setError,
    setNavigate,
    isRecipeValid
  } = useQuickRecipeStore();
  
  // Store navigate function in the global store for use in other components
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (formData: QuickRecipeFormData) => {
    try {
      console.log("Handling form submission:", formData);
      
      if (!formData.mainIngredient || formData.mainIngredient.trim() === '') {
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
      
      // Log in console instead of showing non-error toast
      console.log("Creating your recipe - processing request...");
      
      // Save current path to session storage in case user needs to log in
      sessionStorage.setItem('recipeGenerationSource', JSON.stringify({
        path: location.pathname,
        formData: formData
      }));
      
      // Navigate to the quick recipe page BEFORE starting the API call
      // This ensures the loading animation is displayed
      navigate('/quick-recipe', { 
        state: { fromForm: true, timestamp: Date.now() }
      });
      
      // Start generating the recipe immediately after navigation
      try {
        console.log("Starting recipe generation");
        const generatedRecipe = await generateQuickRecipe(formData);
        
        // Validate the recipe structure before setting it
        if (!isRecipeValid(generatedRecipe)) {
          throw new Error("The recipe format returned from the API was invalid. Please try again.");
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
        } else if (error.status === 400) {
          errorMessage = "Invalid recipe request. Please check your inputs and try again.";
        } else if (error.message?.includes('Edge Function')) {
          errorMessage = "We're having trouble connecting to our recipe service. Please try again shortly.";
        }
        
        // Set descriptive error with timeout flag if applicable
        setError(errorMessage, isTimeout);
        
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
  }, [navigate, reset, setLoading, setFormData, setRecipe, setError, isRecipeValid, location.pathname]);

  return {
    handleSubmit,
    navigate,
    location,
    reset,
    recipe
  };
}

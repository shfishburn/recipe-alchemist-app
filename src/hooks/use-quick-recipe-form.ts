
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
      
      // Reset any previous state
      reset();
      
      // Set loading state immediately so it shows the loading animation
      setLoading(true);
      setFormData(formData);
      
      // Show loading toast
      toast({
        title: "Creating your recipe",
        description: "Your delicious recipe is being crafted...",
        duration: 3000
      });
      
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
        
        // Success toast
        toast({
          title: "Recipe created!",
          description: "Your delicious recipe is ready.",
          variant: "success",
        });
        
        return generatedRecipe;
      } catch (error: any) {
        console.error('Error generating recipe:', error);
        setLoading(false);
        setError(error.message || "Failed to generate recipe. Please try again.");
        
        // Error toast
        toast({
          title: "Recipe generation failed",
          description: error.message || "Please try again later.",
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
  }, [navigate, reset, setLoading, setFormData, setRecipe, setError, isRecipeValid, toast]);

  return {
    handleSubmit,
    navigate,
    location,
    reset,
    recipe
  };
}

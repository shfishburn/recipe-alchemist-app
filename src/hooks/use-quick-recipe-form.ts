
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

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
  const handleSubmit = async (formData: QuickRecipeFormData) => {
    try {
      console.log("Handling form submission:", formData);
      
      // Reset any previous state
      reset();
      
      // Set loading state immediately so it shows the loading animation
      setLoading(true);
      setFormData(formData);
      
      // Navigate to the quick recipe page BEFORE starting the API call
      // This ensures the loading animation is displayed
      navigate('/quick-recipe', { 
        state: { fromForm: true } // Add state to indicate this is from form submission
      });
      
      // Start generating the recipe immediately after navigation
      try {
        const generatedRecipe = await generateQuickRecipe(formData);
        
        // Validate the recipe structure before setting it
        if (!isRecipeValid(generatedRecipe)) {
          throw new Error("The recipe format returned from the API was invalid. Please try again.");
        }
        
        console.log("Recipe generation successful:", generatedRecipe);
        setRecipe(generatedRecipe);
        return generatedRecipe;
      } catch (error: any) {
        console.error('Error generating recipe:', error);
        setLoading(false);
        setError(error.message || "Failed to generate recipe. Please try again.");
        return null;
      }
    } catch (error: any) {
      console.error('Error submitting quick recipe form:', error);
      setLoading(false);
      setError(error.message || "Failed to generate recipe. Please try again.");
      return null;
    }
  };

  return {
    handleSubmit,
    navigate,
    location,
    reset,
    recipe,
    generateQuickRecipe
  };
}

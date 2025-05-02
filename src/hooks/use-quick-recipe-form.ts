
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateQuickRecipe, QuickRecipeFormData } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

export function useQuickRecipeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reset, recipe, setLoading, setRecipe, setFormData, setError } = useQuickRecipeStore();
  const [isLoading, setIsLoadingLocal] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (formData: QuickRecipeFormData) => {
    try {
      // Reset any previous state
      reset();
      
      // Set loading state immediately so it shows the loading animation
      setLoading(true);
      setIsLoadingLocal(true);
      setFormData(formData);
      
      // Navigate to the quick recipe page BEFORE starting the API call
      // This ensures the loading animation is displayed
      navigate('/quick-recipe', { 
        state: { fromForm: true } // Add state to indicate this is from form submission
      });
      
      // Small delay to ensure UI updates before heavy processing begins
      setTimeout(async () => {
        try {
          // Start generating the recipe AFTER navigation
          const generatedRecipe = await generateQuickRecipe(formData);
          setRecipe(generatedRecipe);
          setIsLoadingLocal(false);
          return generatedRecipe;
        } catch (innerError) {
          console.error('Error generating recipe:', innerError);
          setLoading(false);
          setIsLoadingLocal(false);
          setError(innerError.message || "Failed to generate recipe");
          return null;
        }
      }, 50);
      
      return null;
    } catch (error) {
      console.error('Error submitting quick recipe form:', error);
      setLoading(false);
      setIsLoadingLocal(false);
      setError(error.message || "Failed to generate recipe");
      return null;
    }
  };

  return {
    handleSubmit,
    isLoading: isLoading,
    navigate,
    location,
    reset,
    recipe,
    generateQuickRecipe
  };
}

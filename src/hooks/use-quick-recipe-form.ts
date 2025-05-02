
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
    setNavigate
  } = useQuickRecipeStore();
  const [isLoading, setIsLoadingLocal] = useState(false);
  
  // Store navigate function in the global store for use in other components
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);
  
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
      
      // Start generating the recipe immediately after navigation
      try {
        const generatedRecipe = await generateQuickRecipe(formData);
        setRecipe(generatedRecipe);
        setIsLoadingLocal(false);
        return generatedRecipe;
      } catch (error) {
        console.error('Error generating recipe:', error);
        setLoading(false);
        setIsLoadingLocal(false);
        setError(error.message || "Failed to generate recipe");
        return null;
      }
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

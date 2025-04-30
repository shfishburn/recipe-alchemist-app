
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';

export function useQuickRecipeForm() {
  const { generateQuickRecipe, isLoading } = useQuickRecipe();
  const navigate = useNavigate();
  const location = useLocation();
  const { reset, recipe, setLoading } = useQuickRecipeStore();
  
  // Handle form submission
  const handleSubmit = async (formData: QuickRecipeFormData) => {
    try {
      // Set loading state immediately so it shows the loading animation
      setLoading(true);
      
      // Navigate to the quick recipe page BEFORE starting the API call
      // This ensures the loading animation is displayed
      navigate('/quick-recipe');
      
      // Start generating the recipe AFTER navigation
      const recipe = await generateQuickRecipe(formData);
      
      return recipe;
    } catch (error) {
      console.error('Error submitting quick recipe form:', error);
      setLoading(false);
      return null;
    }
  };

  return {
    handleSubmit,
    isLoading,
    navigate,
    location,
    reset,
    recipe,
    generateQuickRecipe
  };
}

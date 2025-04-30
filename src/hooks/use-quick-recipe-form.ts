
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { QuickRecipeFormData } from '@/hooks/use-quick-recipe';

export function useQuickRecipeForm() {
  const { generateQuickRecipe, isLoading } = useQuickRecipe();
  const navigate = useNavigate();
  const location = useLocation();
  const { reset, recipe } = useQuickRecipeStore();
  
  // Handle form submission
  const handleSubmit = async (formData: QuickRecipeFormData) => {
    // Start generating the recipe
    const recipe = await generateQuickRecipe(formData);
    
    // Navigate to the quick recipe page
    if (recipe) {
      navigate('/quick-recipe');
    }
    
    return recipe;
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

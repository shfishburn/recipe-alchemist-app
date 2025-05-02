
import React, { useEffect, useCallback } from 'react';
import { QuickRecipeFormContainer } from './QuickRecipeFormContainer';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';

export function QuickRecipeGenerator() {
  const { navigate, location, reset, recipe, handleSubmit } = useQuickRecipeForm();
  
  // Debounce regeneration to prevent thrashing
  const regenerateRecipe = useCallback(async (formData) => {
    reset(); // Clear any existing recipe
    // Navigate directly instead of waiting for the recipe
    navigate('/quick-recipe', { 
      replace: true,
      state: { regenerate: true, formData } // Keep the state and formData
    });
  }, [navigate, reset]);
  
  // Check if we need to regenerate a recipe based on navigation state
  useEffect(() => {
    const state = location.state as { regenerate?: boolean; formData?: any } | null;
    
    if (state?.regenerate && state.formData) {
      // Use the handleSubmit to properly handle the regeneration
      handleSubmit(state.formData);
    }
  }, [location, handleSubmit]);

  return <QuickRecipeFormContainer />;
}

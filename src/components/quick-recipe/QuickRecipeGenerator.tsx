
import React, { useEffect, useCallback } from 'react';
import { QuickRecipeFormContainer } from './QuickRecipeFormContainer';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';

export function QuickRecipeGenerator() {
  const { navigate, location, reset, recipe, generateQuickRecipe } = useQuickRecipeForm();
  
  // Debounce regeneration to prevent thrashing
  const regenerateRecipe = useCallback(async (formData) => {
    reset(); // Clear any existing recipe
    // Navigate directly instead of waiting for the recipe
    navigate('/quick-recipe', { 
      replace: true,
      state: { regenerate: true } // Keep the state to indicate this is not a direct navigation
    });
    
    // Small delay to ensure UI updates before heavy processing
    setTimeout(() => {
      generateQuickRecipe(formData);
    }, 50);
  }, [generateQuickRecipe, navigate, reset]);
  
  // Check if we need to regenerate a recipe based on navigation state
  useEffect(() => {
    const state = location.state as { regenerate?: boolean; formData?: any } | null;
    
    if (state?.regenerate && state.formData) {
      regenerateRecipe(state.formData);
    }
  }, [location, regenerateRecipe]);

  return <QuickRecipeFormContainer />;
}

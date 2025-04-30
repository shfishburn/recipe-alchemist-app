
import React, { useEffect } from 'react';
import { QuickRecipeFormContainer } from './QuickRecipeFormContainer';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';

export function QuickRecipeGenerator() {
  const { navigate, location, reset, recipe, generateQuickRecipe } = useQuickRecipeForm();
  
  // Check if we need to regenerate a recipe based on navigation state
  useEffect(() => {
    const state = location.state as { regenerate?: boolean; formData?: any } | null;
    
    if (state?.regenerate && state.formData) {
      const regenerate = async () => {
        reset(); // Clear any existing recipe
        // Navigate directly instead of waiting for the recipe
        navigate('/quick-recipe', { 
          replace: true,
          state: { regenerate: true } // Keep the state to indicate this is not a direct navigation
        });
        // Generate the recipe after navigation
        await generateQuickRecipe(state.formData);
      };
      
      regenerate();
    }
  }, [location, generateQuickRecipe, navigate, reset]);

  return <QuickRecipeFormContainer />;
}

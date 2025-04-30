
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
        await generateQuickRecipe(state.formData);
        // Navigate without the state to prevent infinite loop
        navigate('/quick-recipe', { replace: true });
      };
      
      regenerate();
    }
  }, [location, generateQuickRecipe, navigate, reset]);

  // If we already have a recipe, navigate to the quick recipe page
  useEffect(() => {
    if (recipe) {
      navigate('/quick-recipe');
    }
  }, [recipe, navigate]);
  
  return <QuickRecipeFormContainer />;
}

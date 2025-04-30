
import React, { useEffect } from 'react';
import { QuickRecipeTagForm } from './QuickRecipeTagForm';
import { useQuickRecipe } from '@/hooks/use-quick-recipe';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

export function QuickRecipeGenerator() {
  const { generateQuickRecipe, isLoading } = useQuickRecipe();
  const navigate = useNavigate();
  const location = useLocation();
  const { reset, recipe } = useQuickRecipeStore();
  
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
  
  const handleSubmit = async (formData) => {
    // Start generating the recipe
    const recipe = await generateQuickRecipe(formData);
    
    // Navigate to the quick recipe page
    if (recipe) {
      navigate('/quick-recipe');
    }
    
    return recipe;
  };
  
  return (
    <div className="w-full">
      <QuickRecipeTagForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}

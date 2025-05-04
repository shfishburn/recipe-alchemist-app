
import React from 'react';
import { RecipeAnalysis } from '@/components/recipe-detail/analysis/RecipeAnalysis';
import type { Recipe } from '@/types/recipe';

interface ScienceTabContentProps {
  recipe: Recipe;
  onRecipeUpdate: (recipe: Recipe) => void;
}

export function ScienceTabContent({ recipe, onRecipeUpdate }: ScienceTabContentProps) {
  return (
    <RecipeAnalysis 
      recipe={recipe}
      isOpen={true} // Always open in its dedicated tab
      onRecipeUpdate={onRecipeUpdate}
    />
  );
}

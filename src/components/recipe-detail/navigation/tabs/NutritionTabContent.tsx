
import React from 'react';
import { RecipeNutrition } from '@/components/recipe-detail/RecipeNutrition';
import type { Recipe } from '@/types/recipe';
import { useRecipeSections } from '@/hooks/use-recipe-sections';

interface NutritionTabContentProps {
  recipe: Recipe;
  onRecipeUpdate: (recipe: Recipe) => void;
}

export function NutritionTabContent({ recipe, onRecipeUpdate }: NutritionTabContentProps) {
  const { sections, toggleSection } = useRecipeSections();

  return (
    <div className="space-y-6">
      <RecipeNutrition 
        recipe={recipe}
        isOpen={true} // Always open in its dedicated tab
        onToggle={() => {}} // No-op since we're always showing it
        onRecipeUpdate={onRecipeUpdate}
      />
    </div>
  );
}

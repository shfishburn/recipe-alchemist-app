
import React, { useState } from 'react';
import { RecipeAnalysis } from '@/components/recipe-detail/analysis/RecipeAnalysis';
import type { Recipe } from '@/types/recipe';

interface ScienceTabContentProps {
  recipe: Recipe;
  onRecipeUpdate: (recipe: Recipe) => void;
}

export function ScienceTabContent({ recipe, onRecipeUpdate }: ScienceTabContentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="space-y-6">
      <RecipeAnalysis 
        recipe={recipe}
        isOpen={true} // Always open in its dedicated tab
        onToggle={() => {}} // No-op since we're always showing it
        onRecipeUpdated={onRecipeUpdate}
      />
    </div>
  );
}

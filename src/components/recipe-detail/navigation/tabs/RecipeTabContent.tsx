
import React from 'react';
import { RecipeOverview } from '@/components/recipe-detail/RecipeOverview';
import { RecipeIngredients } from '@/components/recipe-detail/RecipeIngredients';
import { RecipeInstructions } from '@/components/recipe-detail/RecipeInstructions';
import type { Recipe } from '@/types/recipe';
import { useRecipeSections } from '@/hooks/use-recipe-sections';

interface RecipeTabContentProps {
  recipe: Recipe;
}

export function RecipeTabContent({ recipe }: RecipeTabContentProps) {
  const { sections, toggleSection } = useRecipeSections();

  return (
    <div className="space-y-6">
      <RecipeOverview recipe={recipe} />
      
      <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <RecipeIngredients 
            recipe={recipe}
            isOpen={sections.ingredients}
            onToggle={() => toggleSection('ingredients')}
          />
        </div>
        <div className="md:col-span-2">
          <RecipeInstructions 
            recipe={recipe}
            isOpen={sections.instructions}
            onToggle={() => toggleSection('instructions')}
          />
        </div>
      </div>
    </div>
  );
}

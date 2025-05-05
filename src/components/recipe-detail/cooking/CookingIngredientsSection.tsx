
import React from 'react';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface CookingIngredientsSectionProps {
  recipe: Recipe;
}

export function CookingIngredientsSection({ recipe }: CookingIngredientsSectionProps) {
  return (
    <div className="px-4 py-2">
      <h3 className="text-lg font-medium mb-2">Ingredients</h3>
      <div className="rounded-lg border p-4 bg-muted/30">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <div className="flex-1">
                <span className="font-medium">{ingredient.qty} {ingredient.unit}</span> {ingredient.item}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

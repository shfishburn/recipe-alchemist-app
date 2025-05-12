
import React from 'react';
import { Ingredient } from '@/types/quick-recipe';

interface QuickRecipeIngredientsProps {
  ingredients: Ingredient[];
}

export function QuickRecipeIngredients({ ingredients }: QuickRecipeIngredientsProps) {
  return (
    <div className="space-y-2">
      <ul className="list-disc pl-5 space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {typeof ingredient === 'string' 
              ? ingredient 
              : `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name}`.trim()}
          </li>
        ))}
      </ul>
    </div>
  );
}

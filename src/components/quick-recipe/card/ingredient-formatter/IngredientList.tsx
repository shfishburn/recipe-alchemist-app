
import React from 'react';
import { FormatIngredient } from './FormatIngredient';
import { Ingredient } from '@/types/quick-recipe';

interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  // Handle edge cases
  if (!ingredients || ingredients.length === 0) {
    return <div className="text-muted-foreground italic">No ingredients listed</div>;
  }
  
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {ingredients.map((ingredient, index) => (
        <li key={index} className="pb-0.5">
          {/* Add extra safeguard for invalid ingredient data */}
          {ingredient ? (
            <FormatIngredient ingredient={ingredient} />
          ) : (
            <span className="text-muted-foreground">Unknown ingredient</span>
          )}
        </li>
      ))}
    </ul>
  );
}

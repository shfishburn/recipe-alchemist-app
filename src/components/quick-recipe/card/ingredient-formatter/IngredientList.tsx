
import React from 'react';
import { FormatIngredient } from './FormatIngredient';
import { Ingredient } from '@/hooks/use-quick-recipe';

interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  if (!ingredients || ingredients.length === 0) {
    return <div className="text-muted-foreground italic">No ingredients listed</div>;
  }
  
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {ingredients.map((ingredient, index) => (
        <li key={index} className="pb-0.5">
          <FormatIngredient ingredient={ingredient} />
        </li>
      ))}
    </ul>
  );
}

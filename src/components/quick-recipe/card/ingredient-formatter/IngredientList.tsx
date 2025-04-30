
import React from 'react';
import { FormatIngredient } from './FormatIngredient';

interface IngredientListProps {
  ingredients: any[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {ingredients.map((ingredient, index) => (
        <li key={index}>
          <FormatIngredient ingredient={ingredient} />
        </li>
      ))}
    </ul>
  );
}

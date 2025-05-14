
import React from 'react';
import { Ingredient } from '@/types/quick-recipe';

interface IngredientListProps {
  ingredients: Ingredient[];
  onChange?: (ingredients: Ingredient[]) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Ingredients</h4>
      <ul className="list-disc pl-5 space-y-1">
        {ingredients.map((ingredient, index) => {
          // Handle string ingredients or object ingredients
          if (typeof ingredient === 'string') {
            return <li key={index} className="text-sm">{ingredient}</li>;
          }
          
          // Handle object ingredients
          const displayName = typeof ingredient.item === 'string' 
            ? ingredient.item 
            : typeof ingredient.item === 'object' && ingredient.item !== null
              ? (ingredient.item as any).name || 'Ingredient'
              : 'Ingredient';
            
          return (
            <li key={index} className="text-sm">
              {ingredient.qty || ''} {ingredient.unit || ''} {displayName}
              {ingredient.notes && <span className="text-muted-foreground ml-1">({ingredient.notes})</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

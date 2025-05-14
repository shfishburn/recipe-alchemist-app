
import React from 'react';
import { Ingredient } from '@/types/quick-recipe';

interface IngredientListProps {
  ingredients: Ingredient[] | string[];
  onChange?: (ingredients: Ingredient[] | string[]) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Ingredients</h4>
      <ul className="list-disc pl-5 space-y-1">
        {ingredients.map((ingredient, index) => {
          // Handle string ingredients
          if (typeof ingredient === 'string') {
            return <li key={index} className="text-sm">{ingredient}</li>;
          }
          
          // Handle object ingredients
          if (typeof ingredient === 'object' && ingredient !== null) {
            const item = ingredient.item;
            const displayName = typeof item === 'string' 
              ? item 
              : (item && typeof item === 'object' && (item as any).name) 
                ? (item as any).name 
                : 'Ingredient';
              
            return (
              <li key={index} className="text-sm">
                {ingredient.qty || ''} {ingredient.unit || ''} {displayName}
                {ingredient.notes && <span className="text-muted-foreground ml-1">({ingredient.notes})</span>}
              </li>
            );
          }
          
          // Fallback for unexpected types
          return <li key={index} className="text-sm">Unknown ingredient</li>;
        })}
      </ul>
    </div>
  );
};

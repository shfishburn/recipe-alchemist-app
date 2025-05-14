
import React from 'react';
import { SimpleIngredientDisplay } from './SimpleIngredientDisplay';

interface IngredientListProps {
  ingredients: any[]; // Accept both string[] and object[] types
  onChange?: (ingredients: any[]) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Ingredients</h4>
      <SimpleIngredientDisplay ingredients={ingredients} />
    </div>
  );
};

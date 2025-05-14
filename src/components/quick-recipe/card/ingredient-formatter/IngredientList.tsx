
import React from 'react';
import { SimpleIngredientDisplay } from '../../ingredient/SimpleIngredientDisplay';

interface IngredientListProps {
  ingredients: any[]; // Accept both string[] and object[] types
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return <SimpleIngredientDisplay ingredients={ingredients} />;
}

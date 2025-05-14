
import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { SimpleIngredientDisplay } from '../ingredient/SimpleIngredientDisplay';

interface RecipeIngredientsProps {
  ingredients: any[]; // Accept both string[] and object[] types
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <div className="mb-6">
      <RecipeSectionHeader title="Ingredients" />
      <SimpleIngredientDisplay ingredients={ingredients} />
    </div>
  );
}

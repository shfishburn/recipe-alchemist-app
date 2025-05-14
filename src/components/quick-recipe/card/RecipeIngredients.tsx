
import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { IngredientList } from './ingredient-formatter/IngredientList';
import { Ingredient } from '@/hooks/use-quick-recipe';

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <div className="mb-6">
      <RecipeSectionHeader title="Ingredients" />
      <IngredientList ingredients={ingredients} />
    </div>
  );
}


import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { IngredientList } from './ingredient-formatter/IngredientList';
import { Ingredient } from '@/hooks/use-quick-recipe';

interface RecipeIngredientsProps {
  ingredients: any[];
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <div>
      <RecipeSectionHeader title="Ingredients" />
      <IngredientList ingredients={ingredients} />
    </div>
  );
}

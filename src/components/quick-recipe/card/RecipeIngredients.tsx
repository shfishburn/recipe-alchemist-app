
import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { Ingredient } from '@/hooks/use-quick-recipe';

interface RecipeIngredientsProps {
  ingredients: any[];
}

// Helper function to format ingredient display text
const formatIngredient = (ingredient: any): string => {
  if (typeof ingredient === 'string') {
    return ingredient;
  }
  
  const { qty, unit, item, notes } = ingredient;
  let formatted = '';
  
  if (qty) {
    formatted += qty + ' ';
  }
  
  if (unit) {
    formatted += unit + ' ';
  }
  
  if (typeof item === 'string') {
    formatted += item;
  } else if (item && typeof item.item === 'string') {
    formatted += item.item;
  }
  
  if (notes) {
    formatted += ` (${notes})`;
  }
  
  return formatted.trim();
};

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <div>
      <RecipeSectionHeader title="Ingredients" />
      <ul className="list-disc pl-5 space-y-1">
        {ingredients.map((ingredient, index) => (
          <li key={index}>{formatIngredient(ingredient)}</li>
        ))}
      </ul>
    </div>
  );
}


import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import { Ingredient } from '@/hooks/use-quick-recipe';

interface RecipeIngredientsProps {
  ingredients: any[];
}

// Helper function to format ingredient display text
const formatIngredient = (ingredient: any): string => {
  if (typeof ingredient === 'string') {
    return ingredient;
  }
  
  const { qty, unit, shop_size_qty, shop_size_unit, item, notes } = ingredient;
  let formatted = '';
  
  // Use shop size if available, otherwise use regular quantity
  const displayQty = shop_size_qty !== undefined ? shop_size_qty : qty;
  const displayUnit = shop_size_unit || unit;
  
  if (displayQty) {
    formatted += displayQty + ' ';
  }
  
  if (displayUnit) {
    formatted += displayUnit + ' ';
  }
  
  // Handle different item formats
  let itemText = '';
  if (typeof item === 'string') {
    itemText = item;
  } else if (item && typeof item === 'object' && 'item' in item) {
    itemText = item.item;
  } else if (item) {
    itemText = String(item);
  }
  
  formatted += `**${itemText}**`;  // Format with ** for ingredient highlighting
  
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
          <li key={index}>
            <FormattedIngredientText text={formatIngredient(ingredient)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

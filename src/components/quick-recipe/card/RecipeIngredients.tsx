
import React from 'react';
import { RecipeSectionHeader } from './RecipeSectionHeader';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import { formatIngredient } from '@/utils/ingredient-format';
import { Ingredient } from '@/hooks/use-quick-recipe';

interface RecipeIngredientsProps {
  ingredients: any[];
}

// Helper function to format ingredient display text with markdown
const formatIngredientWithMarkdown = (ingredient: any): string => {
  const formatted = formatIngredient(ingredient);
  
  // Extract the item text to wrap in markdown
  let parts = formatted.split(' ');
  if (parts.length > 0) {
    // Get the last part that should be the item name (without quantity/unit)
    const lastPart = parts[parts.length - 1];
    // Replace the last part with the marked up version
    parts[parts.length - 1] = `**${lastPart}**`;
  }
  
  return parts.join(' ');
};

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <div>
      <RecipeSectionHeader title="Ingredients" />
      <ul className="list-disc pl-5 space-y-1">
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            <FormattedIngredientText text={formatIngredientWithMarkdown(ingredient)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

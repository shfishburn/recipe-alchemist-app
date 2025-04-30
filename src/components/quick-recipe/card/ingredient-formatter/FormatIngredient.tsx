
import React from 'react';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import { formatIngredient } from '@/utils/ingredient-format';
import { Ingredient } from '@/hooks/use-quick-recipe';

// Helper function to format ingredient display text with markdown
export const formatIngredientWithMarkdown = (ingredient: Ingredient): string => {
  try {
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
  } catch (error) {
    console.error("Error formatting ingredient:", error);
    return ingredient.item ? `**${ingredient.item}**` : "Unknown ingredient";
  }
};

interface FormatIngredientProps {
  ingredient: Ingredient;
}

export function FormatIngredient({ ingredient }: FormatIngredientProps) {
  return (
    <FormattedIngredientText text={formatIngredientWithMarkdown(ingredient)} />
  );
}

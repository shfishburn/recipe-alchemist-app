
import React from 'react';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import { formatIngredient } from '@/utils/ingredient-format';

// Helper function to format ingredient display text with markdown
export const formatIngredientWithMarkdown = (ingredient: any): string => {
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

interface FormatIngredientProps {
  ingredient: any;
}

export function FormatIngredient({ ingredient }: FormatIngredientProps) {
  return (
    <FormattedIngredientText text={formatIngredientWithMarkdown(ingredient)} />
  );
}

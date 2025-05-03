
import React from 'react';
import { FormattedIngredientText } from '@/components/recipe-chat/response/FormattedIngredientText';
import { formatIngredient } from '@/utils/ingredient-format';
import { Ingredient } from '@/hooks/use-quick-recipe';
import { useUnitSystem } from '@/hooks/use-unit-system';

// Helper function to format ingredient display text with markdown
export const formatIngredientWithMarkdown = (ingredient: Ingredient, unitSystem: 'metric' | 'imperial'): string => {
  try {
    // Use the same utility for consistency across the app but pass unit system explicitly
    const formatted = formatIngredient(ingredient, unitSystem);
    
    // Extract parts for highlighting
    const parts = formatted.split(' ');
    let itemText = '';
    
    // Find the item part to highlight - handle null safety
    if (ingredient && typeof ingredient.item === 'string') {
      itemText = ingredient.item;
    } else if (ingredient && ingredient.item && typeof ingredient.item === 'object') {
      itemText = typeof ingredient.item.item === 'string' ? ingredient.item.item : String(ingredient.item);
    }
    
    // Find and highlight the item text
    if (itemText) {
      let result = formatted;
      // Make sure we don't replace partial words
      const regex = new RegExp(`\\b${itemText}\\b`, 'i');
      result = formatted.replace(regex, `**${itemText}**`);
      return result;
    }
    
    // Fallback to highlighting the last word
    if (parts.length > 0) {
      const lastIndex = parts.length - 1;
      parts[lastIndex] = `**${parts[lastIndex]}**`;
    }
    
    return parts.join(' ');
  } catch (error) {
    console.error("Error formatting ingredient:", error);
    return ingredient && ingredient.item ? 
      `**${typeof ingredient.item === 'string' ? ingredient.item : JSON.stringify(ingredient.item)}**` 
      : "Unknown ingredient";
  }
};

interface FormatIngredientProps {
  ingredient: Ingredient;
}

export function FormatIngredient({ ingredient }: FormatIngredientProps) {
  const { unitSystem } = useUnitSystem();

  return (
    <FormattedIngredientText text={formatIngredientWithMarkdown(ingredient, unitSystem)} />
  );
}


import React from 'react';
import { processInlineFormatting } from './utils/text-formatting';

interface FormattedIngredientTextProps {
  text: string;
}

/**
 * Component to process and format ingredient text with styling
 * Used in both RecipeSteps and QuickCookingMode
 * Always returns a single React element
 */
export function FormattedIngredientText({ text }: FormattedIngredientTextProps) {
  // Handle undefined or empty text
  if (!text) {
    return <span></span>;
  }
  
  // Use the shared text formatting utility
  const formattedContent = processInlineFormatting(text);
  
  // Ensure we wrap content in a single element for React.Children.only compatibility
  return <span className="ingredient-text">{formattedContent}</span>;
}

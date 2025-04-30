
import React from 'react';
import { processInlineFormatting } from './utils/text-formatting';

interface FormattedIngredientTextProps {
  text: string;
}

/**
 * Component to process and format ingredient text with styling
 * Used in both RecipeSteps and QuickCookingMode
 */
export function FormattedIngredientText({ text }: FormattedIngredientTextProps) {
  // Use the shared text formatting utility
  const formattedContent = processInlineFormatting(text);
  
  return <>{formattedContent}</>;
}


import React from 'react';
import { processInlineFormatting } from './utils/text-formatting';

interface FormattedIngredientTextProps {
  text: string;
}

/**
 * Component to process and format ingredient text with styling
 * Used in both RecipeSteps and QuickCookingMode
 * Always returns a single React element with proper error handling
 */
export function FormattedIngredientText({ text }: FormattedIngredientTextProps) {
  // Handle undefined, null or empty text
  if (!text) {
    return <span></span>;
  }
  
  try {
    // Use the shared text formatting utility
    const formattedContent = processInlineFormatting(text);
    
    // Ensure we wrap content in a single element for React.Children.only compatibility
    return <span className="ingredient-text">{formattedContent}</span>;
  } catch (error) {
    console.error("Error formatting ingredient text:", error);
    // Return the original text as fallback
    return <span className="ingredient-text">{text}</span>;
  }
}

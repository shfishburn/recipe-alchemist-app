
import React from 'react';
import { processInlineFormatting } from './utils/text-formatting';

interface FormattedIngredientTextProps {
  text: string;
}

/**
 * Component to process and format ingredient text with styling
 * Always returns a single React element with proper error handling
 */
export function FormattedIngredientText({ text }: FormattedIngredientTextProps) {
  // Handle undefined, null or empty text
  if (!text) {
    return <span></span>;
  }
  
  try {
    // Process the text with the formatting utility
    const formattedContent = processInlineFormatting(text);
    
    // Always wrap the result in a span to ensure we return a single React element
    // This ensures compatibility with components that expect a single child
    return <span className="ingredient-text" aria-live="polite">{formattedContent}</span>;
  } catch (error) {
    console.error("Error formatting ingredient text:", error);
    // Return the original text as fallback
    return <span className="ingredient-text">{text}</span>;
  }
}

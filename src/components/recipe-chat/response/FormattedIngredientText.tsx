
import React from 'react';
import { processInlineFormatting } from './utils/text-formatting';
import { cn } from '@/lib/utils';

interface FormattedIngredientTextProps {
  text: string;
  className?: string;
}

/**
 * Component to process and format ingredient text with styling
 * Always returns a single React element with proper error handling
 */
export function FormattedIngredientText({ text, className }: FormattedIngredientTextProps) {
  // Handle undefined, null or empty text
  if (!text) {
    return <span></span>;
  }
  
  try {
    // Process the text with the formatting utility
    const formattedContent = processInlineFormatting(text);
    
    // Always wrap the result in a span to ensure we return a single React element
    // This ensures compatibility with components that expect a single child
    return <span className={cn("ingredient-text", className)}>{formattedContent}</span>;
  } catch (error) {
    console.error("Error formatting ingredient text:", error);
    // Return the original text as fallback
    return <span className={cn("ingredient-text", className)}>{text}</span>;
  }
}

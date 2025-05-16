
import type { ChangesResponse } from '@/types/chat';

export interface TextHighlightOptions {
  boldIngredients?: boolean;
  highlightTechniques?: boolean;
  highlightTemperatures?: boolean;
}

/**
 * Highlights specific text patterns in recipe instructions
 * @param text The text to process
 * @param options Highlighting options
 * @returns The text with HTML formatting applied
 */
export function highlightRecipeText(text: string, options: TextHighlightOptions = {}): string {
  if (!text) return '';

  let processedText = text;
  
  // Handle ingredient highlighting
  if (options.boldIngredients) {
    // Pattern to match ingredients (basic implementation)
    const ingredientPattern = /\b(flour|sugar|salt|butter|oil|eggs|milk|water|chicken|beef|pork|fish)\b/gi;
    processedText = processedText.replace(ingredientPattern, '<strong>$1</strong>');
  }
  
  // Handle technique highlighting
  if (options.highlightTechniques) {
    // Pattern to match cooking techniques
    const techniquePattern = /\b(bake|roast|broil|grill|sauté|fry|simmer|boil|steam)\b/gi;
    processedText = processedText.replace(techniquePattern, '<em class="text-blue-600">$1</em>');
  }
  
  // Handle temperature highlighting
  if (options.highlightTemperatures) {
    // Pattern to match temperatures (both Fahrenheit and Celsius)
    const tempPattern = /\b(\d{2,3})°([FC])\b/g;
    processedText = processedText.replace(tempPattern, '<span class="text-red-500">$1°$2</span>');
  }
  
  return processedText;
}

/**
 * Compares changes made to instructions and highlights differences
 * @param originalText Original instruction text
 * @param newText Updated instruction text
 * @returns HTML with highlighted differences
 */
export function highlightChanges(originalText: string, newText: string): string {
  // This is a simplified implementation
  // A real diff algorithm would be more complex
  
  if (originalText === newText) {
    return newText;
  }
  
  // Very basic highlighting - in a real implementation we'd use a proper diff algorithm
  return `<span class="bg-yellow-100">${newText}</span>`;
}

/**
 * Highlights changes in a recipe based on the ChangesResponse
 * @param original The original recipe text or instruction
 * @param changes The changes object containing modifications
 * @returns HTML with highlighted changes
 */
export function highlightRecipeChanges(
  original: string | string[],
  changes: ChangesResponse
): string {
  // Simplified implementation
  if (typeof original === 'string') {
    return original;
  }
  
  // For arrays of instructions, return the original
  return Array.isArray(original) ? original.join('\n') : original;
}

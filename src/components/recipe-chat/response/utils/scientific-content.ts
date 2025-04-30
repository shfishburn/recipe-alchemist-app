
/**
 * Checks if text contains scientific methodology sections
 */
export function isMethodologyDocument(text: string): boolean {
  return text.includes('Methodology') || 
         text.includes('⸻') ||
         text.includes('1. Standardized Ingredient Breakdown');
}

/**
 * List of scientific terminology commonly used in recipe science explanations
 */
export const scientificTerms = [
  'maillard', 'reaction', 'chemistry', 'temperature', 'techniques',
  'protein', 'structure', 'starch', 'gelatinization', 'degree',
  'celsius', 'fahrenheit', 'hydration', 'fat', 'emulsion', 'science',
  'methodology', 'analysis', 'nutrition', 'kcal', 'calories', 'macros',
  'standardized', 'breakdown', 'ingredient', 'carbs', 'fiber', 'sugar',
  'sodium', 'summation', 'verification'
];

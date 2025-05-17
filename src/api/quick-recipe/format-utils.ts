
import { QuickRecipeFormData } from '@/types/quick-recipe';

/**
 * Formats the request body for the generate-quick-recipe edge function
 * @param formData Form data from the recipe generation form
 * @returns Formatted request body
 */
export const formatRequestBody = (formData: QuickRecipeFormData) => {
  // Ensure formData is properly structured even if parts are missing
  const sanitizedFormData = {
    mainIngredient: formData.mainIngredient || '',
    cuisine: formData.cuisine || [],
    dietary: formData.dietary || [],
    servings: formData.servings || 2
  };

  // Format the request body to match the API expectations
  return {
    // The main ingredient request - extract from the form data
    ingredients: sanitizedFormData.mainIngredient,
    
    // Convert cuisine to array if it's a string
    cuisine: Array.isArray(sanitizedFormData.cuisine) 
      ? sanitizedFormData.cuisine 
      : sanitizedFormData.cuisine ? [sanitizedFormData.cuisine] : ['any'],
    
    // Convert dietary to array if it's a string
    dietary: Array.isArray(sanitizedFormData.dietary)
      ? sanitizedFormData.dietary
      : sanitizedFormData.dietary ? [sanitizedFormData.dietary] : [],
    
    // Ensure servings is a number
    servings: Number(sanitizedFormData.servings) || 2,
    
    // Add metadata for logging
    metadata: {
      source: 'web-app',
      version: '2.0',
      timestamp: new Date().toISOString()
    }
  };
};

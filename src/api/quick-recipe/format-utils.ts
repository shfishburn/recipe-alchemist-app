
/**
 * Utility functions for formatting recipe requests
 */

import { QuickRecipeFormData } from '@/types/quick-recipe';

export const formatRequestBody = (formData: QuickRecipeFormData) => {
  // Extract values from form data with defaults
  const {
    mainIngredient,
    cuisine = ['any'],
    dietary = [],
    servings = 2,
    maxCalories,
  } = formData;
  
  // Process ingredients - we now use mainIngredient since ingredients doesn't exist in the type
  let ingredients: string[] = [];
  
  if (mainIngredient) {
    // If we have a specific mainIngredient field, use it
    if (typeof mainIngredient === 'string') {
      ingredients.push(mainIngredient);
    } else if (mainIngredient && Array.isArray(mainIngredient)) {
      // If it's an array, add all items
      (mainIngredient as string[]).forEach(item => {
        if (item && typeof item === 'string') {
          ingredients.push(item);
        }
      });
    }
  }
  
  // Ensure we have at least one ingredient
  if (ingredients.length === 0) {
    ingredients = ['chef\'s choice'];
  }
  
  // Format the request body
  return {
    ingredients,
    cuisine: Array.isArray(cuisine) ? cuisine : [cuisine],
    dietary: Array.isArray(dietary) ? dietary : [dietary],
    servings: parseInt(servings as any) || 2,
    max_calories: maxCalories ? parseInt(maxCalories as any) : undefined,
    allow_time: 120000, // 2 minutes
    user_id: null // Will be set by the server if authenticated
  };
};

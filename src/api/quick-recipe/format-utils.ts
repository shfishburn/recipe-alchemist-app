
/**
 * Utility functions for formatting recipe requests
 */

import { QuickRecipeFormData } from '@/types/quick-recipe';

export const formatRequestBody = (formData: QuickRecipeFormData) => {
  // Extract values from form data with defaults
  const {
    ingredients: rawIngredients,
    cuisine = ['any'],
    dietary = [],
    servings = 2,
    maxCalories,
    mainIngredient,
  } = formData;
  
  // Process ingredients - accept string or array input
  let ingredients: string[] = [];
  
  if (mainIngredient) {
    // If we have a specific mainIngredient field, use it
    ingredients.push(mainIngredient);
  }
  
  // Add regular ingredients if they exist
  if (rawIngredients) {
    if (typeof rawIngredients === 'string') {
      // Single string ingredient
      if (!ingredients.includes(rawIngredients)) {
        ingredients.push(rawIngredients);
      }
    } else if (Array.isArray(rawIngredients)) {
      // Array of ingredients - filter out duplicates and empty strings
      rawIngredients.forEach(item => {
        if (item && typeof item === 'string' && !ingredients.includes(item)) {
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

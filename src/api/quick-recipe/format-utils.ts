
import { QuickRecipeFormData } from '@/types/quick-recipe';

// Functions to format and process form data for API requests

// Process cuisine values properly
export const processCuisineValue = (cuisineValue: string | string[]): string => {
  if (typeof cuisineValue === 'string') {
    if (cuisineValue.toLowerCase() === 'any') {
      return "";
    } else if (cuisineValue) {
      return cuisineValue.split(',').map(c => c.trim()).filter(Boolean).join(', ');
    }
    return cuisineValue || "";
  }
  
  return Array.isArray(cuisineValue) ? cuisineValue.join(', ') : "";
};

// Process dietary values properly
export const processDietaryValue = (dietaryValue: string | string[]): string => {
  if (typeof dietaryValue === 'string') {
    if (dietaryValue.toLowerCase() === 'any') {
      return "";
    } else if (dietaryValue) {
      return dietaryValue.split(',').map(d => d.trim()).filter(Boolean).join(', ');
    }
    return dietaryValue || "";
  }
  
  return Array.isArray(dietaryValue) ? dietaryValue.join(', ') : "";
};

// Format request body for the API call
export const formatRequestBody = (formData: QuickRecipeFormData) => {
  const cuisineString = processCuisineValue(formData.cuisine);
  const dietaryString = processDietaryValue(formData.dietary);
  
  // Define the request body with properly formatted values
  return {
    cuisine: cuisineString || "Any",
    dietary: dietaryString || "",
    mainIngredient: formData.mainIngredient.trim(),
    servings: formData.servings || 2,
    maxCalories: formData.maxCalories
  };
};

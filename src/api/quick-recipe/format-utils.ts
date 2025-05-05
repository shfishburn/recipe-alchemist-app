import { QuickRecipeFormData } from '@/types/quick-recipe';
import { getCuisineCategoryByValue } from '@/config/cuisine-config';

// Functions to format and process form data for API requests

// Determine cuisine category from cuisine values
export const getCuisineCategory = (cuisineValue: string): "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern" => {
  // Use the centralized configuration to determine the category
  return getCuisineCategoryByValue(cuisineValue);
};

// Process cuisine values properly to match database enum values
export const processCuisineValue = (cuisineValue: string | string[]): string => {
  // Safety check for null or undefined
  if (cuisineValue === null || cuisineValue === undefined) {
    console.log("Cuisine value is null or undefined, defaulting to 'any'");
    return "any";
  }
  
  if (typeof cuisineValue === 'string') {
    const trimmedValue = cuisineValue.trim();
    
    if (trimmedValue.toLowerCase() === 'any' || trimmedValue === '') {
      console.log("Processing cuisine value 'any' or empty string to 'any'");
      return "any";
    } else if (trimmedValue) {
      // Convert UI cuisine values to match database enum values if needed
      console.log(`Processing string cuisine value: "${trimmedValue}"`);
      return trimmedValue.split(',').map(c => c.trim()).filter(Boolean).join(', ');
    }
    console.log("Cuisine string was falsy, returning 'any'");
    return "any";
  }
  
  if (Array.isArray(cuisineValue)) {
    if (cuisineValue.length === 0) {
      console.log("Empty cuisine array, returning 'any'");
      return "any";
    }
    const filteredValues = cuisineValue.filter(Boolean).map(v => v.trim());
    console.log(`Processing array cuisine value with ${filteredValues.length} items: ${JSON.stringify(filteredValues)}`);
    return filteredValues.length > 0 ? filteredValues.join(', ') : "any";
  }
  
  console.log(`Unknown cuisine value type: ${typeof cuisineValue}, value:`, cuisineValue);
  return "any";
};

// Process dietary values properly
export const processDietaryValue = (dietaryValue: string | string[]): string => {
  // Safety check for null or undefined
  if (dietaryValue === null || dietaryValue === undefined) {
    return "";
  }
  
  if (typeof dietaryValue === 'string') {
    const trimmedValue = dietaryValue.trim();
    
    if (trimmedValue.toLowerCase() === 'any' || trimmedValue === '') {
      return "";
    } else if (trimmedValue) {
      return trimmedValue.split(',').map(d => d.trim()).filter(Boolean).join(', ');
    }
    return "";
  }
  
  if (Array.isArray(dietaryValue)) {
    return dietaryValue.filter(Boolean).map(v => v.trim()).join(', ');
  }
  
  return "";
};

// Format request body for the API call
export const formatRequestBody = (formData: QuickRecipeFormData) => {
  const cuisineString = processCuisineValue(formData.cuisine);
  const dietaryString = processDietaryValue(formData.dietary);
  
  // Define the request body with properly formatted values
  return {
    cuisine: cuisineString || "any",
    dietary: dietaryString || "",
    mainIngredient: formData.mainIngredient.trim(),
    servings: formData.servings || 2,
    maxCalories: formData.maxCalories,
    cuisineCategory: getCuisineCategory(cuisineString)
  };
};

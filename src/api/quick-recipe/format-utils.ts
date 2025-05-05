
import { QuickRecipeFormData } from '@/types/quick-recipe';

// Functions to format and process form data for API requests

// Determine cuisine category from cuisine values
export const getCuisineCategory = (cuisineValue: string): "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern" => {
  const lowerCuisine = cuisineValue.toLowerCase();
  
  // Regional American cuisines
  if (['cajun-creole', 'midwest', 'new-england', 'pacific-northwest', 'southern', 'southwestern', 'tex-mex']
      .some(c => lowerCuisine.includes(c))) {
    return "Regional American";
  }
  
  // European cuisines
  if (['british', 'irish', 'eastern-european', 'french', 'german', 'greek', 'italian', 'mediterranean', 
       'scandinavian', 'nordic', 'spanish']
      .some(c => lowerCuisine.includes(c))) {
    return "European";
  }
  
  // Asian cuisines
  if (['chinese', 'indian', 'japanese', 'korean', 'southeast-asian', 'thai', 'vietnamese']
      .some(c => lowerCuisine.includes(c))) {
    return "Asian";
  }
  
  // Dietary styles
  if (['gluten-free', 'keto', 'low-fodmap', 'paleo', 'plant-based', 'vegetarian', 'whole30',
       'vegan', 'dairy-free', 'low-carb']
      .some(c => lowerCuisine.includes(c))) {
    return "Dietary Styles";
  }
  
  // Middle Eastern cuisines
  if (['middle-eastern', 'lebanese', 'turkish', 'persian', 'moroccan']
      .some(c => lowerCuisine.includes(c))) {
    return "Middle Eastern";
  }
  
  // Default
  return "Global";
};

// Process cuisine values properly to match database enum values
export const processCuisineValue = (cuisineValue: string | string[]): string => {
  if (typeof cuisineValue === 'string') {
    if (cuisineValue.toLowerCase() === 'any') {
      return "";
    } else if (cuisineValue) {
      // Convert UI cuisine values to match database enum values if needed
      // This ensures values like "thai" are properly formatted
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
    maxCalories: formData.maxCalories,
    cuisineCategory: cuisineString ? getCuisineCategory(cuisineString) : "Global"
  };
};

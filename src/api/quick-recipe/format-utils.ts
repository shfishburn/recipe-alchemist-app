
import { QuickRecipeFormData } from '@/types/quick-recipe';

// Functions to format and process form data for API requests

// Determine cuisine category from cuisine values - used for API calls only
// NOTE: Database uses the trigger to set this value, not this function
export const getCuisineCategory = (cuisineValue: string): "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern" => {
  // This function now matches database trigger logic
  const cuisine = cuisineValue.toLowerCase().trim();
  
  if (['mexican', 'cajun-creole', 'midwest', 'new-england', 'pacific-northwest', 'southern', 'southwestern', 'tex-mex'].includes(cuisine)) {
    return "Regional American";
  } else if (['british-irish', 'eastern-european', 'french', 'german', 'greek', 'italian', 'mediterranean', 'scandinavian-nordic', 'spanish'].includes(cuisine)) {
    return "European";
  } else if (['chinese', 'indian', 'japanese', 'korean', 'southeast-asian', 'thai', 'vietnamese'].includes(cuisine)) {
    return "Asian";
  } else if (['middle-eastern', 'lebanese', 'turkish', 'persian', 'moroccan'].includes(cuisine)) {
    return "Middle Eastern";
  } else if (['gluten-free', 'keto', 'low-fodmap', 'paleo', 'plant-based', 'vegetarian', 'whole30'].includes(cuisine)) {
    return "Dietary Styles";
  } else {
    return "Global";
  }
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

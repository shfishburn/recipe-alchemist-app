
import { QuickRecipeFormData } from '@/types/quick-recipe';

// Functions to format and process form data for API requests

// Determine cuisine category from cuisine values - used for API calls only
export const getCuisineCategory = (cuisineValue: string): "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern" => {
  // This function now matches database trigger logic
  if (!cuisineValue || typeof cuisineValue !== 'string') {
    return "Global";
  }
  
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
    const trimmedValue = cuisineValue.trim().toLowerCase(); // Always normalize to lowercase
    
    if (trimmedValue === '' || trimmedValue.toLowerCase() === 'any') {
      console.log("Processing cuisine value 'any' or empty string to 'any'");
      return "any";
    } else {
      // Return the normalized value - the database trigger will handle categorization
      console.log(`Using normalized cuisine value: "${trimmedValue}"`);
      return trimmedValue;
    }
  }
  
  if (Array.isArray(cuisineValue)) {
    if (cuisineValue.length === 0) {
      console.log("Empty cuisine array, returning 'any'");
      return "any";
    }
    
    // Process array of values - take the first valid one or default to "any"
    const filteredValues = cuisineValue.filter(Boolean).map(v => typeof v === 'string' ? v.trim().toLowerCase() : v);
    console.log(`Processing array cuisine value with ${filteredValues.length} items:`, filteredValues);
    
    // Return the first value from the array
    if (filteredValues.length > 0) {
      const firstValue = filteredValues[0];
      if (typeof firstValue === 'string') {
        console.log(`Using first value from cuisine array: "${firstValue}"`);
        return firstValue;
      }
    }
    
    return "any";
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
    return dietaryValue.filter(Boolean).map(v => typeof v === 'string' ? v.trim() : v).join(', ');
  }
  
  return "";
};

// Format request body for the API call
export const formatRequestBody = (formData: QuickRecipeFormData) => {
  // Handle array and string formats consistently
  let cuisineValue = formData.cuisine;
  console.log("Original cuisine value in formatRequestBody:", cuisineValue);
  
  if (Array.isArray(cuisineValue) && cuisineValue.length > 0) {
    // Use first selected cuisine if it's an array
    cuisineValue = cuisineValue[0];
    console.log("Using first value from cuisine array:", cuisineValue);
  } else if (Array.isArray(cuisineValue) && cuisineValue.length === 0) {
    cuisineValue = "any";
    console.log("Empty cuisine array, using 'any'");
  }
  
  const cuisineString = processCuisineValue(cuisineValue);
  const dietaryString = processDietaryValue(formData.dietary);
  const cuisineCategory = getCuisineCategory(cuisineString);
  
  console.log(`Format request body - cuisine: "${cuisineString}", category: "${cuisineCategory}"`);
  
  // Define the request body with properly formatted values
  return {
    cuisine: cuisineString || "any",
    dietary: dietaryString || "",
    mainIngredient: formData.mainIngredient.trim(),
    servings: formData.servings || 2,
    maxCalories: formData.maxCalories,
    cuisineCategory: cuisineCategory
  };
};

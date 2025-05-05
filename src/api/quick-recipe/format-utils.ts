
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
    const trimmedValue = cuisineValue.trim().toLowerCase(); // Always normalize to lowercase
    
    // Define valid cuisine values that match exactly what the database trigger expects
    const validCuisines = [
      'any', 
      // Regional American cuisines
      'mexican', 'cajun-creole', 'midwest', 'new-england', 
      'pacific-northwest', 'southern', 'southwestern', 'tex-mex',
      // European cuisines
      'british-irish', 'eastern-european', 'french', 'german', 
      'greek', 'italian', 'mediterranean', 'scandinavian-nordic', 'spanish',
      // Asian cuisines
      'chinese', 'indian', 'japanese', 'korean', 
      'southeast-asian', 'thai', 'vietnamese',
      // Middle Eastern cuisines
      'middle-eastern', 'lebanese', 'turkish', 'persian', 'moroccan',
      // Dietary styles
      'gluten-free', 'keto', 'low-fodmap', 'paleo', 
      'plant-based', 'vegetarian', 'whole30'
    ];
    
    if (trimmedValue === '' || trimmedValue.toLowerCase() === 'any') {
      console.log("Processing cuisine value 'any' or empty string to 'any'");
      return "any";
    } else if (trimmedValue) {
      // Check if the cuisine value is valid as is
      if (validCuisines.includes(trimmedValue)) {
        console.log(`Using validated cuisine value: "${trimmedValue}"`);
        return trimmedValue;
      } else {
        // If not valid, try to find a close match or default to "any"
        console.log(`Warning: Cuisine value "${trimmedValue}" not in valid list, defaulting to "any"`);
        return "any";
      }
    }
    console.log("Cuisine string was falsy, returning 'any'");
    return "any";
  }
  
  if (Array.isArray(cuisineValue)) {
    if (cuisineValue.length === 0) {
      console.log("Empty cuisine array, returning 'any'");
      return "any";
    }
    
    // Process array of values - take the first valid one or default to "any"
    const filteredValues = cuisineValue.filter(Boolean).map(v => v.trim().toLowerCase());
    console.log(`Processing array cuisine value with ${filteredValues.length} items: ${JSON.stringify(filteredValues)}`);
    
    // Define valid cuisine values that match exactly what the database trigger expects
    const validCuisines = [
      'any', 'mexican', 'cajun-creole', 'midwest', 'new-england', 
      'pacific-northwest', 'southern', 'southwestern', 'tex-mex',
      'british-irish', 'eastern-european', 'french', 'german', 
      'greek', 'italian', 'mediterranean', 'scandinavian-nordic', 'spanish',
      'chinese', 'indian', 'japanese', 'korean', 
      'southeast-asian', 'thai', 'vietnamese',
      'middle-eastern', 'lebanese', 'turkish', 'persian', 'moroccan',
      'gluten-free', 'keto', 'low-fodmap', 'paleo', 
      'plant-based', 'vegetarian', 'whole30'
    ];
    
    // Find the first valid cuisine value
    for (const value of filteredValues) {
      if (validCuisines.includes(value)) {
        console.log(`Using first valid cuisine from array: "${value}"`);
        return value;
      }
    }
    
    // If no valid values found, return "any"
    console.log("No valid cuisines found in array, returning 'any'");
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

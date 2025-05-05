
/**
 * Cuisine configuration - Single source of truth for cuisine values
 * 
 * This configuration maps cuisine values to their categories to ensure
 * consistency across UI components, API processing, and database operations.
 */

// Define cuisine categories that match the database enum values
export type CuisineCategory = "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern";

// Interface for cuisine option items
export interface CuisineOption {
  value: string;
  label: string;
  category: CuisineCategory;
}

// Group options by category for UI display
export interface CuisineGroupedOptions {
  category: CuisineCategory;
  options: CuisineOption[];
}

// Master list of all cuisines with their proper categorization
// This provides a single source of truth for the entire application
export const CUISINE_OPTIONS: CuisineOption[] = [
  // Global cuisines
  { value: "any", label: "Any Cuisine", category: "Global" },
  { value: "american", label: "American", category: "Global" },
  { value: "brazilian", label: "Brazilian", category: "Global" },
  { value: "caribbean", label: "Caribbean", category: "Global" },
  { value: "fusion", label: "Fusion", category: "Global" },
  
  // Regional American cuisines
  { value: "cajun-creole", label: "Cajun/Creole", category: "Regional American" },
  { value: "mexican", label: "Mexican", category: "Regional American" }, // Added Mexican cuisine
  { value: "midwest", label: "Midwest", category: "Regional American" },
  { value: "new-england", label: "New England", category: "Regional American" },
  { value: "pacific-northwest", label: "Pacific Northwest", category: "Regional American" },
  { value: "southern", label: "Southern", category: "Regional American" },
  { value: "southwestern", label: "Southwestern", category: "Regional American" },
  { value: "tex-mex", label: "Tex-Mex", category: "Regional American" },
  
  // European cuisines
  { value: "british-irish", label: "British/Irish", category: "European" },
  { value: "eastern-european", label: "Eastern European", category: "European" },
  { value: "french", label: "French", category: "European" },
  { value: "german", label: "German", category: "European" },
  { value: "greek", label: "Greek", category: "European" },
  { value: "italian", label: "Italian", category: "European" },
  { value: "mediterranean", label: "Mediterranean", category: "European" },
  { value: "scandinavian-nordic", label: "Scandinavian/Nordic", category: "European" },
  { value: "spanish", label: "Spanish", category: "European" },
  
  // Asian cuisines
  { value: "chinese", label: "Chinese", category: "Asian" },
  { value: "indian", label: "Indian", category: "Asian" },
  { value: "japanese", label: "Japanese", category: "Asian" },
  { value: "korean", label: "Korean", category: "Asian" },
  { value: "southeast-asian", label: "Southeast Asian", category: "Asian" },
  { value: "thai", label: "Thai", category: "Asian" },
  { value: "vietnamese", label: "Vietnamese", category: "Asian" },
  
  // Middle Eastern cuisines
  { value: "middle-eastern", label: "Middle Eastern", category: "Middle Eastern" },
  { value: "lebanese", label: "Lebanese", category: "Middle Eastern" },
  { value: "turkish", label: "Turkish", category: "Middle Eastern" },
  { value: "persian", label: "Persian", category: "Middle Eastern" },
  { value: "moroccan", label: "Moroccan", category: "Middle Eastern" },
  
  // Dietary Styles
  { value: "gluten-free", label: "Gluten-Free", category: "Dietary Styles" },
  { value: "keto", label: "Keto", category: "Dietary Styles" },
  { value: "low-fodmap", label: "Low-FODMAP", category: "Dietary Styles" },
  { value: "paleo", label: "Paleo", category: "Dietary Styles" },
  { value: "plant-based", label: "Plant-Based", category: "Dietary Styles" },
  { value: "vegetarian", label: "Vegetarian", category: "Dietary Styles" },
  { value: "whole30", label: "Whole30", category: "Dietary Styles" },
];

// Group cuisines by category for UI components
export const GROUPED_CUISINE_OPTIONS: CuisineGroupedOptions[] = [
  {
    category: "Global",
    options: CUISINE_OPTIONS.filter(cuisine => cuisine.category === "Global")
  },
  {
    category: "Regional American",
    options: CUISINE_OPTIONS.filter(cuisine => cuisine.category === "Regional American")
  },
  {
    category: "European",
    options: CUISINE_OPTIONS.filter(cuisine => cuisine.category === "European")
  },
  {
    category: "Asian",
    options: CUISINE_OPTIONS.filter(cuisine => cuisine.category === "Asian")
  },
  {
    category: "Middle Eastern",
    options: CUISINE_OPTIONS.filter(cuisine => cuisine.category === "Middle Eastern")
  },
  {
    category: "Dietary Styles",
    options: CUISINE_OPTIONS.filter(cuisine => cuisine.category === "Dietary Styles")
  }
];

// Helper function to find cuisine category by value
export const getCuisineCategoryByValue = (value: string): CuisineCategory => {
  // Handle empty or any values
  if (!value || value.trim() === '' || value.toLowerCase() === 'any') {
    return "Global";
  }
  
  // Trim and lowercase for consistent matching
  const normalizedValue = value.toLowerCase().trim();
  
  // Find matching cuisine in our master list
  const matchedCuisine = CUISINE_OPTIONS.find(cuisine => 
    cuisine.value.toLowerCase() === normalizedValue || 
    normalizedValue.includes(cuisine.value)
  );
  
  // If found, return its category
  if (matchedCuisine) {
    return matchedCuisine.category;
  }
  
  // Special case for hyphenated/non-hyphenated variations
  if (normalizedValue === "mexican" || normalizedValue.includes("mexican")) {
    return "Regional American";
  }
  
  // Default to Global when no match is found
  console.warn(`No cuisine category found for value "${value}", defaulting to "Global"`);
  return "Global";
};

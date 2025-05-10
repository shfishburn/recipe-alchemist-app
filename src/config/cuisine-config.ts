/**
 * CuisineConfig.ts
 * Version: 2.2.0
 * Date: 2025-05-10
 *
 * Expanded to cover a full taxonomy of world cuisines, grouped for UI use.
 */

// Define cuisine categories matching database enum values
export type CuisineCategory =
  | "Global"
  | "Regional American"
  | "European"
  | "Asian"
  | "Middle Eastern"
  | "Dietary Styles"
  | "African"
  | "Latin American"
  | "Caribbean"
  | "Central American"
  | "South American"
  | "Pacific"
  | "Oceanian"
  | "Central Asian"
  | "Indigenous"
  | "Jewish"

// Interface for a cuisine option
export interface CuisineOption {
  value: string
  label: string
  category: CuisineCategory
}

// Grouped structure for UI components
export interface CuisineGroupedOptions {
  category: CuisineCategory
  options: CuisineOption[]
}

// Master list of all cuisines with proper categorization
export const CUISINE_OPTIONS: CuisineOption[] = [
  // Global
  { value: "any", label: "Any Cuisine", category: "Global" },
  { value: "american", label: "American", category: "Global" },
  { value: "brazilian", label: "Brazilian", category: "Global" },
  { value: "fusion", label: "Fusion", category: "Global" },

  // Regional American
  { value: "cajun-creole", label: "Cajun/Creole", category: "Regional American" },
  { value: "mexican", label: "Mexican", category: "Regional American" },
  { value: "midwest", label: "Midwest", category: "Regional American" },
  { value: "new-england", label: "New England", category: "Regional American" },
  { value: "pacific-northwest", label: "Pacific Northwest", category: "Regional American" },
  { value: "southern", label: "Southern", category: "Regional American" },
  { value: "southwestern", label: "Southwestern", category: "Regional American" },
  { value: "tex-mex", label: "Tex-Mex", category: "Regional American" },

  // European
  { value: "british-irish", label: "British/Irish", category: "European" },
  { value: "eastern-european", label: "Eastern European", category: "European" },
  { value: "french", label: "French", category: "European" },
  { value: "german", label: "German", category: "European" },
  { value: "greek", label: "Greek", category: "European" },
  { value: "italian", label: "Italian", category: "European" },
  { value: "mediterranean", label: "Mediterranean", category: "European" },
  { value: "scandinavian-nordic", label: "Scandinavian/Nordic", category: "European" },
  { value: "spanish", label: "Spanish", category: "European" },

  // Asian
  { value: "chinese", label: "Chinese", category: "Asian" },
  { value: "indian", label: "Indian", category: "Asian" },
  { value: "japanese", label: "Japanese", category: "Asian" },
  { value: "korean", label: "Korean", category: "Asian" },
  { value: "southeast-asian", label: "Southeast Asian", category: "Asian" },
  { value: "thai", label: "Thai", category: "Asian" },
  { value: "vietnamese", label: "Vietnamese", category: "Asian" },

  // Middle Eastern
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

  // African
  { value: "north-african", label: "North African", category: "African" },
  { value: "egyptian", label: "Egyptian", category: "African" },
  { value: "tunisian", label: "Tunisian", category: "African" },
  { value: "ethiopian", label: "Ethiopian", category: "African" },
  { value: "nigerian", label: "Nigerian", category: "African" },
  { value: "ghanaian", label: "Ghanaian", category: "African" },

  // Latin American
  { value: "peruvian", label: "Peruvian", category: "Latin American" },
  { value: "argentinian", label: "Argentinian", category: "Latin American" },
  { value: "colombian", label: "Colombian", category: "Latin American" },

  // Caribbean
  { value: "jamaican", label: "Jamaican", category: "Caribbean" },
  { value: "trinidadian", label: "Trinidadian", category: "Caribbean" },
  { value: "haitian", label: "Haitian", category: "Caribbean" },

  // Central American
  { value: "guatemalan", label: "Guatemalan", category: "Central American" },
  { value: "costa-rican", label: "Costa Rican", category: "Central American" },
  { value: "honduran", label: "Honduran", category: "Central American" },

  // South American
  { value: "chilean", label: "Chilean", category: "South American" },
  { value: "venezuelan", label: "Venezuelan", category: "South American" },
  { value: "ecuadorian", label: "Ecuadorian", category: "South American" },

  // Pacific
  { value: "filipino", label: "Filipino", category: "Pacific" },
  { value: "indonesian", label: "Indonesian", category: "Pacific" },
  { value: "malaysian", label: "Malaysian", category: "Pacific" },
  { value: "singaporean", label: "Singaporean", category: "Pacific" },
  { value: "hawaiian", label: "Hawaiian", category: "Pacific" },
  { value: "polynesian", label: "Polynesian", category: "Pacific" },

  // Oceanian
  { value: "australian", label: "Australian", category: "Oceanian" },
  { value: "new-zealander", label: "New Zealander", category: "Oceanian" },
  { value: "maori", label: "Māori", category: "Oceanian" },

  // Central Asian
  { value: "uzbek", label: "Uzbek", category: "Central Asian" },
  { value: "kazakh", label: "Kazakh", category: "Central Asian" },
  { value: "turkmen", label: "Turkmen", category: "Central Asian" },
  { value: "afghan", label: "Afghan", category: "Central Asian" },

  // Indigenous
  { value: "native-american", label: "Native American", category: "Indigenous" },

  // Jewish
  { value: "ashkenazi", label: "Ashkenazi", category: "Jewish" },
  { value: "sephardic", label: "Sephardic", category: "Jewish" },
  { value: "ethiopian-jewish", label: "Ethiopian-Jewish", category: "Jewish" }
]

// Group for UI components
export const GROUPED_CUISINE_OPTIONS: CuisineGroupedOptions[] =
  [
    "Global",
    "Regional American",
    "European",
    "Asian",
    "Middle Eastern",
    "Dietary Styles",
    "African",
    "Latin American",
    "Caribbean",
    "Central American",
    "South American",
    "Pacific",
    "Oceanian",
    "Central Asian",
    "Indigenous",
    "Jewish"
  ].map(cat => ({
    category: cat as CuisineCategory,
    options: CUISINE_OPTIONS.filter(c => c.category === cat)
  }))

// Helper to find category by value
export const getCuisineCategoryByValue = (value: string): CuisineCategory => {
  const normalized = value.toLowerCase().trim()
  const match = CUISINE_OPTIONS.find(c => c.value === normalized)
  if (match) return match.category
  console.warn(`Unknown cuisine "${value}", defaulting to Global`)
  return "Global"
}

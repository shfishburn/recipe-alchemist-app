
// Shared ingredient interface to be used across the app
export interface Ingredient {
  // Metric measurements
  qty_metric?: number;
  unit_metric?: string;
  // Imperial measurements
  qty_imperial?: number;
  unit_imperial?: string;
  // Original measurement (backwards compatibility)
  qty?: number;
  unit?: string;
  // Common fields
  item: string | Record<string, any>;
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}

// Version information
export interface VersionInfo {
  version_number: number;
  parent_version_id?: string;
  modification_reason: string;
  created_at?: string;
  version_id?: string;
}

// Define the complete nutrition type instead of using 'any'
export interface RecipeNutrition {
  // Basic nutrition (with both naming conventions)
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  
  // Aliases for backwards compatibility
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  
  // Micronutrients
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  cholesterol?: number;
  
  // Alternative naming for micronutrients (aliases)
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  
  // Enhanced nutrition data properties
  data_quality?: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
    penalties?: Record<string, any>;
    unmatched_or_low_confidence_ingredients?: string[];
    limitations?: string[];
  };
  per_ingredient?: Record<string, any>;
  audit_log?: Record<string, any>;
  
  // Added for compatibility with standardized nutrition
  carbohydrates?: number;
}

// The NutriScore type
export interface NutriScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "E";
  negative_points: {
    energy: number;
    saturated_fat: number;
    sugars: number;
    sodium: number;
    total: number;
  };
  positive_points: {
    fiber: number;
    protein: number;
    fruit_veg_nuts: number;
    total: number;
  };
  category?: string;
  calculation_version?: string;
  calculated_at?: string;
}

// The main QuickRecipe type that will become our unified recipe type
export interface QuickRecipe {
  title: string;
  tagline?: string;
  description?: string;
  ingredients: Ingredient[];
  steps?: string[];
  instructions?: string[];
  servings: number;
  prep_time_min?: number;
  cook_time_min?: number;
  prepTime?: number;
  cookTime?: number;
  nutrition?: RecipeNutrition;
  science_notes?: string[];
  nutritionHighlight?: string;
  cookingTip?: string;
  cuisine?: string[] | string;
  dietary?: string[] | string;
  flavor_tags?: string[];
  highlights?: string[];
  user_id?: string;
  id?: string;
  slug?: string;
  // Version-related properties
  version_id?: string;
  version_info?: VersionInfo;
  // Additional fields from Recipe type
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  original_request?: string;
  reasoning?: string;
  chef_notes?: string;
  version_number?: number;
  previous_version_id?: string;
  cuisine_category?: "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern";
  nutri_score?: NutriScore;
  // Error-related properties
  error?: string;
  error_message?: string;
  isError?: boolean;
}

// Form data types preserved
export interface QuickRecipeFormData {
  cuisine: string[] | string;
  dietary: string[] | string;
  mainIngredient: string;
  servings: number;
  maxCalories?: number;
}

export interface QuickRecipeOptions {
  cuisine: string[] | string;
  dietary: string[] | string;
  flavorTags: string[];
  servings: number;
  maxCalories?: number;
  recipeRequest?: string;
}

// Alias Recipe to QuickRecipe for backward compatibility
export type Recipe = QuickRecipe;

// Export the RecipeNutrition type for use in other files
export type { RecipeNutrition as Nutrition };


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
}

// QuickRecipe interface that's compatible with Recipe
export interface QuickRecipe {
  id?: string; // Made optional to match usage in LoadingPage
  title: string;
  tagline?: string;
  description?: string;
  ingredients: Ingredient[];
  instructions?: string[]; // Made optional but we'll handle both instructions and steps
  steps?: string[]; // For backwards compatibility
  servings: number; // Required in QuickRecipe
  prep_time_min?: number;
  cook_time_min?: number;
  prepTime?: number;
  cookTime?: number;
  nutrition?: any;
  science_notes?: string[];
  nutritionHighlight?: string;
  cookingTip?: string;
  cuisine?: string[] | string;
  dietary?: string[] | string;
  flavor_tags?: string[];
  highlights?: string[];
  user_id?: string;
  slug?: string;
  // Version-related properties
  version_id?: string;
  version_info?: VersionInfo;
  // Error-related properties
  error?: string;
  error_message?: string;
  isError?: boolean;
}

// Export Recipe type - explicitly define what's required and what's optional
// to align with the Recipe type from recipe.ts
export interface Recipe extends QuickRecipe {
  id: string; // Required in Recipe type
  instructions: string[]; // Required in Recipe type
  servings: number; // Explicitly required in both types
}

export interface QuickRecipeFormData {
  cuisine: string[] | string;
  dietary: string[] | string; // Required
  mainIngredient: string;
  servings: number;
  maxCalories?: number;
  recipeRequest?: string;
}

export interface QuickRecipeOptions {
  cuisine: string[] | string;
  dietary: string[] | string;
  flavorTags: string[];
  servings: number;
  maxCalories?: number;
  recipeRequest?: string;
}

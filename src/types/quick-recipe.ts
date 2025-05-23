
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

// Rename/alias QuickRecipe as Recipe for backward compatibility
export type Recipe = QuickRecipe;

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
  nutrition?: any;
  science_notes?: string[];
  nutritionHighlight?: string;
  cookingTip?: string;
  cuisine?: string[] | string;
  dietary?: string[] | string;
  flavor_tags?: string[];
  highlights?: string[]; // Added for RecipeHighlights component
  user_id?: string;
  id?: string;
  slug?: string;  // Added slug property
  // Version-related properties
  version_id?: string;
  version_info?: VersionInfo;
  // Error-related properties
  error?: string;
  error_message?: string;
  isError?: boolean;
}

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

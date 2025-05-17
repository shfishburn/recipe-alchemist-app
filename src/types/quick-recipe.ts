
import type { Nutrition, NutriScore, CuisineCategory } from './recipe';

export interface Ingredient {
  qty?: number;
  unit?: string;
  item: string | { name: string; [key: string]: any };
  notes?: string;
  qty_metric?: number;
  unit_metric?: string;
  qty_imperial?: number;
  unit_imperial?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}

// Define the form data type for recipe generation
export interface QuickRecipeFormData {
  mainIngredient: string;
  cuisine?: string[] | string;
  dietary?: string[] | string;
  servings?: number;
  maxCalories?: number;
}

// Define recipe version info type
export interface RecipeVersionInfo {
  version_number: number;
  modification_reason?: string;
  modified_at?: string;
  modified_by?: string;
  previous_version_id?: string;
}

export interface QuickRecipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps?: string[];
  instructions?: string[];
  servings: number;
  prep_time_min?: number;
  cook_time_min?: number;
  image_url?: string;
  cuisine?: string;
  cuisine_category?: CuisineCategory;
  tags?: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  original_request?: string;
  reasoning?: string;
  tagline?: string;
  version_number?: number;
  previous_version_id?: string;
  deleted_at?: string | null;
  dietary?: string;
  flavor_tags?: string[];
  nutrition?: Nutrition;
  science_notes?: string[];
  chef_notes?: string;
  nutri_score?: NutriScore;
  slug?: string;
  
  // Additional fields for UI components
  prepTime?: number; // Alias for prep_time_min
  cookTime?: number; // Alias for cook_time_min
  cookingTip?: string; // Cooking tips
  nutritionHighlight?: string; // Highlight of nutritional benefits
  error_message?: string; // Used for error handling
  isError?: boolean; // Flag for error state
  version_info?: RecipeVersionInfo; // Version information
}

// Quick recipe options for API requests
export interface QuickRecipeOptions {
  cuisine?: string[];
  dietary?: string[];
  servings?: number;
  maxCalories?: number;
  restrictions?: string[];
  flavors?: string[];
  ingredients?: string[];
}

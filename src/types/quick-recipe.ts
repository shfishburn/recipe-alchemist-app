
export interface QuickRecipeIngredient {
  item: string | { name?: string; item?: string };
  qty_metric?: number;
  unit_metric?: string;
  qty_imperial?: number;
  unit_imperial?: string;
  qty?: number;
  unit?: string;
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}

export interface QuickRecipe {
  id?: string;
  title: string;
  description?: string;
  tagline?: string;
  ingredients: (QuickRecipeIngredient | string)[];
  steps: string[];
  instructions?: string[]; // Alias for steps in some components
  servings: number;
  prepTime?: string | number;
  cookTime?: string | number;
  totalTime?: string | number;
  prep_time_min?: number;
  cook_time_min?: number;
  cuisine?: string;
  dietary?: string[];
  error_message?: string;
  isError?: boolean;
  nutritionHighlight?: string;
  cookingTip?: string;
  science_notes?: string[];
  flavor_tags?: string[];
  highlights?: string[]; // Adding this missing property
  user_id?: string; // Adding this to fix type error
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    // Additional nutrition fields
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
    kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    vitamin_a_iu?: number;
    vitamin_c_mg?: number;
    vitamin_d_iu?: number;
    calcium_mg?: number;
    iron_mg?: number;
    potassium_mg?: number;
    data_quality?: string;
    calorie_check_pass?: boolean;
  };
}

// Add QuickRecipeFormData interface which was missing
export interface QuickRecipeFormData {
  mainIngredient: string;
  cuisine?: string | string[];
  dietary?: string | string[];
  servings: number;
  additionalIngredients?: string[];
  mealType?: string;
  cookingMethod?: string;
  difficulty?: string;
  preferences?: string[];
  maxCalories?: number; // Add the missing maxCalories property
}

// Re-export Ingredient type for backward compatibility
export type Ingredient = QuickRecipeIngredient | string;

// Re-export Recipe type for backward compatibility
export type Recipe = QuickRecipe;

// Re-export options type for backward compatibility
export interface QuickRecipeOptions {
  servings?: number;
  cuisine?: string | string[];
  dietary?: string | string[];
}

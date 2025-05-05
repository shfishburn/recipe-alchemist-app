
export interface Ingredient {
  // Metric measurements
  qty_metric: number;
  unit_metric: string;
  // Imperial measurements
  qty_imperial: number;
  unit_imperial: string;
  // Original measurement (backwards compatibility)
  qty?: number;
  unit?: string;
  // Common fields
  item: string;
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}

export interface Nutrition {
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

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prep_time_min?: number;
  cook_time_min?: number;
  servings?: number;
  image_url?: string;
  cuisine?: string;
  cuisine_category?: "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern";
  tags?: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  original_request?: string;
  reasoning?: string;
  tagline?: string;
  version_number?: number;
  previous_version_id?: string;
  deleted_at?: string;
  dietary?: string;
  flavor_tags?: string[];
  nutrition?: Nutrition;
  science_notes: string[];
  chef_notes?: string;
  cooking_tip?: string;
  slug?: string;
  nutri_score?: NutriScore;
}

// Export the Nutrition type explicitly
export type { Nutrition as RecipeNutrition };

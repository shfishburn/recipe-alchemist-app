
// Recipe types

export type NutriScore = {
  grade: "A" | "B" | "C" | "D" | "E";
  score: number;
  negative_points?: {
    total: number;
    energy: number;
    saturated_fat: number;
    sugars: number;
    sodium: number;
  };
  positive_points?: {
    total: number;
    fiber: number;
    protein: number;
    fruit_veg_nuts: number;
  };
};

export interface Nutrition {
  kcal?: number;
  calories?: number;  // Alias for kcal
  protein_g?: number;
  protein?: number;   // Alias for protein_g
  carbs_g?: number;
  carbs?: number;     // Alias for carbs_g
  fat_g?: number;
  fat?: number;       // Alias for fat_g
  fiber_g?: number;
  fiber?: number;     // Alias for fiber_g
  sugar_g?: number;
  sugar?: number;     // Alias for sugar_g
  sodium_mg?: number;
  sodium?: number;    // Alias for sodium_mg
  saturated_fat?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
}

export interface Ingredient {
  qty: number;
  unit: string;
  item: string | { item: string };
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
  // Metric/imperial conversion fields
  qty_metric?: number;
  unit_metric?: string;
  qty_imperial?: number;
  unit_imperial?: string;
  quality_indicators?: string;
  alternatives?: string[];
  storage_tips?: string;
}

// Updated Recipe interface to match the database schema
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  tagline?: string;
  ingredients: Array<Ingredient>;
  instructions: string[];
  prep_time_min?: number;
  cook_time_min?: number;
  servings?: number;
  image_url?: string;
  cuisine?: string;
  tags?: string[];
  slug?: string;
  cuisine_category?: "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles" | "Middle Eastern";
  nutrition?: Nutrition;
  nutri_score?: NutriScore;
  // Updated fields to match database schema
  science_notes?: string[];
  chef_notes?: string;
  updated_at?: string;
  user_id?: string;
  dietary?: string;
  flavor_tags?: string[];
  cooking_tip?: string;
  // Additional fields that might exist in the database
  created_at?: string;
  version_number?: number;
  previous_version_id?: string;
  deleted_at?: string;
  reasoning?: string;
}


export interface Ingredient {
  qty: number;
  unit: string;
  item: string;
  notes?: string;
}

export interface Nutrition {
  // Basic nutrition (with both naming conventions)
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  
  // Micronutrients
  vitamin_a_iu?: number;
  vitamin_c_mg?: number;
  vitamin_d_iu?: number;
  calcium_mg?: number;
  iron_mg?: number;
  potassium_mg?: number;
  
  // Alternative naming for micronutrients
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
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
  cuisine_category?: "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles";
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
  cooking_tip?: string; // Added cooking_tip field to match the database schema
}

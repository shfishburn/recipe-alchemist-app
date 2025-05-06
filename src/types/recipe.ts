
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

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Array<{
    qty: number;
    unit: string;
    item: string | { item: string };
    notes?: string;
    shop_size_qty?: number;
    shop_size_unit?: string;
  }>;
  instructions: string[];
  prep_time_min?: number;
  cook_time_min?: number;
  servings?: number;
  image_url?: string;
  cuisine?: string;
  tags?: string[];
  slug?: string;
  cuisine_category?: "Global" | "Regional American" | "European" | "Asian" | "Dietary Styles";
  nutrition?: {
    kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
  };
  nutri_score?: NutriScore;
}


import type { Nutrition, NutriScore } from './recipe';

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
  cuisine_category?: string;
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
}

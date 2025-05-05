
import { Nutrition } from './nutrition';

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  tagline?: string;
  user_id?: string;
  created_at?: string;
  image_url?: string; 
  ingredients: Array<{
    amount?: number;
    unit?: string;
    name: string;
    department?: string;
    notes?: string;
    optional?: boolean;
    // Add compatibility properties for older code
    qty?: number;
    item?: string;
    qty_metric?: number;
    unit_metric?: string;
    qty_imperial?: number;
    unit_imperial?: string;
  }>;
  instructions: Array<{
    step: string;
    group?: string;
  }>;
  nutrition: Nutrition;
  prep_time?: number;
  cook_time?: number;
  // Add compatibility properties for newer code
  prep_time_min?: number;
  cook_time_min?: number;
  servings?: number;
  cuisine?: string;
  cuisine_category?: string;
  difficulty?: string;
  dietary_preferences?: string[];
  tags?: string[];
  rating?: number;
  is_public?: boolean;
  chef_notes?: string;
  science_notes?: string[];
  slug?: string;
  media?: any;
  version?: number;
  nutri_score?: {
    score: number | null;
    grade: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    negative_points: {
      energy: number | null;
      saturated_fat: number | null;
      sugars: number | null;
      sodium: number | null;
      total: number | null;
    };
    positive_points: {
      fiber: number | null;
      protein: number | null;
      fruit_veg_nuts: number | null;
      total: number | null;
    };
    category?: string;
    calculation_version?: string;
    calculated_at?: string;
  };
}

// Export Ingredient type for use in other components
export interface Ingredient {
  qty?: number;
  unit?: string;
  item: string | Record<string, any>;
  notes?: string;
  // Add metric/imperial properties
  qty_metric?: number;
  unit_metric?: string;
  qty_imperial?: number;
  unit_imperial?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
}

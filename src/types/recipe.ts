import { Nutrition } from './nutrition-utils';

// Define the ingredient structure
export interface RecipeIngredient {
  name: string;
  quantity?: string;
  unit?: string;
  notes?: string;
  // For backward compatibility with existing code
  qty?: number | string;
  qty_metric?: number | string;
  qty_imperial?: number | string;
  unit_metric?: string;
  unit_imperial?: string;
  item?: string;
}

export type RecipeInstruction = string | { step: string; group?: string };

export interface Recipe {
  id: string;
  title: string;
  tagline?: string;
  image_url?: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  servings: number;
  prep_time_min?: number;
  cook_time_min?: number;
  // For backward compatibility
  prep_time?: number;
  cook_time?: number;
  nutrition?: Nutrition;
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
  user_id: string;
  created_at?: string;
  updated_at?: string;
  cuisine?: string;
  cuisine_category?: string[];
  dietary?: string;
  chef_notes?: string;
  flavor_tags?: string[];
  slug?: string;
  reasoning?: string;
  science_notes?: any[];
  cooking_tip?: string;
  version_number?: number;
  previous_version_id?: string;
  deleted_at?: string;
  // Other fields for backward compatibility
  description?: string;
}

// Export RecipeIngredient for usage in other files
export type { RecipeIngredient as Ingredient };


import { QuickRecipe } from './quick-recipe';

// Type alias to help with migration from Recipe to QuickRecipe
export type Recipe = QuickRecipe;

// Re-export essential nutrition types that were previously in this file
export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  [key: string]: number | undefined;
}

export interface NutriScore {
  score: number | null;
  grade: string | null;
  category: 'food' | 'beverage';
  calculated_at: string | null;
  calculation_version: string;
  negative_points: {
    total: number | null;
    energy: number | null;
    sugars: number | null;
    saturated_fat: number | null;
    sodium: number | null;
  };
  positive_points: {
    total: number | null;
    protein: number | null;
    fiber: number | null;
    fruit_veg_nuts: number | null;
  };
}

// Add any other types that were used in the old Recipe type but needed by components

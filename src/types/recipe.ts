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
  }>;
  instructions: Array<{
    step: string;
    group?: string;
  }>;
  nutrition: Nutrition;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  cuisine?: string;
  cuisine_category?: string;
  difficulty?: string;
  dietary_preferences?: string[];
  tags?: string[];
  rating?: number;
  is_public?: boolean;
  chef_notes?: string;
  science_notes?: string;
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

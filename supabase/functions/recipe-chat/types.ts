
// Basic types for recipe chat edge function

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
  servings: number;
  prep_time_min?: number;
  cook_time_min?: number;
  cuisine?: string;
  cuisine_category?: string;
  description?: string;
  nutrition?: Nutrition;
  science_notes?: string[];
  version_id?: string;
  [key: string]: any;
}

export interface Ingredient {
  qty_metric: number;
  unit_metric: string;
  qty_imperial: number;
  unit_imperial: string;
  item: string;
  notes?: string;
  shop_size_qty?: number;
  shop_size_unit?: string;
  qty?: number;
  unit?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  [key: string]: any;
}

export interface ChatMessage {
  user_message: string;
  ai_response: string;
  recipe_id: string;
  changes_suggested?: any;
  recipe?: Recipe;
  source_type?: string;
  source_url?: string;
  source_image?: string;
  meta?: any;
  version_id?: string;
}


export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  image_url?: string;
  cuisine?: string;
  tags?: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  original_request?: string;
  reasoning?: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

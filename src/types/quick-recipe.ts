export interface QuickRecipeIngredient {
  item: string;
  qty_metric?: number;
  unit_metric?: string;
  qty_imperial?: number;
  unit_imperial?: string;
}

export interface QuickRecipe {
  id?: string;
  title: string;
  description?: string;
  ingredients: QuickRecipeIngredient[] | string[];
  steps: string[];
  instructions?: string[];
  servings: number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  cuisine?: string;
  dietary?: string[];
  error_message?: string;
  isError?: boolean;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface QuickRecipeFormData {
  mainIngredient?: string;
  ingredients?: string;
  cuisine?: string | string[];
  dietary?: string | string[];
  servings?: number;
  maxCalories?: number;
  url?: string;
  imgUrl?: string;
  imageFile?: File | null;
}


import { Recipe } from '@/types/recipe';

export interface QuickRecipeForm {
  cuisine: string[] | string;
  dietary: string[] | string;  // Changed from optional to required to match QuickRecipeFormData
  mainIngredient: string;
  servings: number;
  maxCalories?: number;
  recipeRequest?: string;
}

export interface RecipeForm extends Partial<Recipe> {
  // Any additional fields specific to the form
  isDraft?: boolean;
  saveAsDraft?: boolean;
}

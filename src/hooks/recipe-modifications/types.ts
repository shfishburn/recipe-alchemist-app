
import { QuickRecipe } from '@/types/quick-recipe';

export type ModificationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'not-deployed'
  | 'not-authenticated'
  | 'canceled'
  | 'applying'
  | 'applied';

export interface IngredientModification {
  original?: string;
  modified: string;
  reason?: string;
}

export interface StepModification {
  original?: string;
  modified: string;
  reason?: string;
}

export interface NutritionImpact {
  assessment: string;
  summary: string;
  details?: string[];
  // Adding the required nutritional properties
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface RecipeModifications {
  textResponse: string; // Required field
  reasoning?: string;
  modifications: {
    title?: string;
    description?: string;
    ingredients?: IngredientModification[];
    steps?: StepModification[];
    cookingTip?: string;
  };
  nutritionImpact: NutritionImpact;
  modifiedRecipe?: QuickRecipe;
}

export interface ModificationHistoryEntry {
  request: string;
  response: RecipeModifications;
  timestamp: string;
  applied: boolean;
}

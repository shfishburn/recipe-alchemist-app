
import { QuickRecipe } from '@/types/quick-recipe';

export type ModificationStatus = 
  'idle' | 
  'loading' | 
  'success' | 
  'error' | 
  'not-authenticated' | 
  'not-deployed' | 
  'canceled' | 
  'applying' | 
  'applied';

export interface NutritionImpact {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  assessment?: string;
  summary?: string; // Add summary property
}

export interface RecipeModifications {
  textResponse: string;
  reasoning: string;
  modifications: {
    title?: string;
    description?: string;
    ingredients?: Array<{
      original?: string;
      modified: string;
      reason?: string;
    }>;
    steps?: Array<{
      original?: string;
      modified: string;
      reason?: string;
    }>;
    cookingTip?: string;
  };
  nutritionImpact?: NutritionImpact;
  // Add support for full modified recipe
  modifiedRecipe?: QuickRecipe | null;
}

export interface ModificationHistoryEntry {
  request: string;
  response: RecipeModifications;
  timestamp: string;
  applied: boolean;
}

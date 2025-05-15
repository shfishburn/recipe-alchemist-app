
import { QuickRecipe } from '@/types/quick-recipe';

// Define the NutritionImpact type
export interface NutritionImpact {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  summary: string;
}

export interface RecipeModifications {
  modifications: {
    title?: string;
    description?: string;
    ingredients?: {
      action: 'add' | 'remove' | 'modify';
      originalIndex?: number;
      item: string;
      qty_metric?: number;
      unit_metric?: string;
      qty_imperial?: number;
      unit_imperial?: string;
      notes?: string;
    }[];
    steps?: {
      action: 'add' | 'remove' | 'modify';
      originalIndex?: number;
      content: string;
    }[];
  };
  nutritionImpact: NutritionImpact;
  reasoning: string;
}

export interface ModificationHistoryEntry {
  request: string;
  response: RecipeModifications;
  timestamp: string;
  applied: boolean;
}

export type ModificationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'applying'
  | 'applied'
  | 'error'
  | 'canceled'
  | 'not-deployed'
  | 'not-authenticated';

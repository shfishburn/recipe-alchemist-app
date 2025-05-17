
import type { QuickRecipe } from '@/types/quick-recipe';

export type ModificationStatus = 
  | 'idle' 
  | 'loading'
  | 'success'
  | 'error'
  | 'applying'
  | 'applied'
  | 'rejected'
  | 'not-authenticated';

export interface RecipeModificationChange {
  property: string;
  original: any;
  modified: any;
}

export interface NutritionImpact {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium?: number;
  fiber?: number;
  sugar?: number;
}

export interface RecipeModifications {
  changes: RecipeModificationChange[];
  summary: string;
  rationale?: string;
  recipe?: QuickRecipe;
  nutritionImpact?: NutritionImpact;
}

export interface VersionInfo {
  version_id: string;
  version_number: number;
  modification_reason?: string;
  modified_at?: string;
  modified_by?: string;
  previous_version_id?: string;
}

export interface RecipeModificationHistoryItem {
  id: string;
  request: string;
  created_at: string;
  status: 'applied' | 'rejected' | 'pending';
}

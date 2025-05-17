
import type { QuickRecipe } from '@/types/quick-recipe';

export type ModificationStatus = 
  | 'idle' 
  | 'loading'
  | 'success'
  | 'error'
  | 'applying'
  | 'applied'
  | 'rejected'
  | 'not-authenticated'
  | 'canceled'
  | 'not-deployed';

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
  summary?: string;
  assessment?: string;
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

export interface VersionHistoryEntry {
  version_id: string;
  version_number: number;
  previous_version_id?: string;
  created_at: string;
  modification_request?: string;
}

export interface ModificationHistoryEntry {
  request: string;
  timestamp: string;
  response: {
    reasoning: string;
  };
  applied: boolean;
}

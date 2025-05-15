
import { QuickRecipe } from '@/types/quick-recipe';

// Define the NutritionImpact type
export interface NutritionImpact {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  assessment?: string;
  summary?: string;
}

// Version information
export interface VersionInfo {
  version_number: number;
  parent_version_id?: string;
  modification_reason: string;
  created_at?: string;
  version_id?: string;
}

// Version history entry
export interface VersionHistoryEntry {
  version_id: string;
  recipe_id: string;
  version_number: number;
  parent_version_id?: string;
  created_at: string;
  user_id?: string;
  modification_request: string;
  recipe_data: QuickRecipe;
}

export interface RecipeModifications {
  textResponse: string;
  reasoning: string;
  recipe: QuickRecipe & { version_info?: VersionInfo };
  nutritionImpact?: NutritionImpact;
  // For backwards compatibility
  modifications?: {
    title?: string;
    description?: string;
    ingredients?: {
      original?: string;
      modified: string;
      reason?: string;
    }[];
    steps?: {
      original?: string;
      modified: string;
      reason?: string;
    }[];
    cookingTip?: string;
  };
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

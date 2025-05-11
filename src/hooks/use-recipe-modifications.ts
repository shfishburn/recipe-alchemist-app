
// This file is now deprecated and serves as a re-export for backwards compatibility
// Import from '@/hooks/recipe-modifications' instead

import { useRecipeModifications } from './recipe-modifications';
export type { 
  ModificationStatus, 
  RecipeModifications,
  NutritionImpact, 
  ModificationHistoryEntry 
} from './recipe-modifications/types';
export { useRecipeModifications };

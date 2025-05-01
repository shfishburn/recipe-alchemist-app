
import type { Recipe } from '@/types/recipe';

interface Update {
  path: string;
  value: any;
}

export function validateRecipeUpdate(recipe: Recipe, updates: Update[]) {
  if (!updates || updates.length === 0) {
    return false;
  }

  if (!recipe?.id) {
    return false;
  }

  // Basic validation - can be extended with more specific rules
  try {
    // Check that updates have valid paths
    for (const update of updates) {
      if (!update.path || update.path.trim() === '') {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}

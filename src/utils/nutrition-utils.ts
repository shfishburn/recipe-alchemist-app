
import type { Nutrition } from '@/types/recipe';

/**
 * Standardizes nutrition data to ensure all required fields are present
 * and both alias versions of properties are populated
 */
export function standardizeNutrition(nutrition: Partial<Nutrition> | null | undefined): Nutrition {
  if (!nutrition) {
    return createEmptyNutrition();
  }

  const standardized: Nutrition = {
    // Start with default values
    kcal: 0,
    calories: 0,
    protein_g: 0, 
    protein: 0,
    carbs_g: 0,
    carbs: 0,
    fat_g: 0, 
    fat: 0,
    fiber_g: 0,
    fiber: 0,
    sugar_g: 0,
    sugar: 0,
    sodium_mg: 0,
    sodium: 0,
    ...nutrition
  };

  // Ensure aliases are synchronized in both directions
  if (nutrition.kcal !== undefined && nutrition.calories === undefined) {
    standardized.calories = nutrition.kcal;
  } else if (nutrition.calories !== undefined && nutrition.kcal === undefined) {
    standardized.kcal = nutrition.calories;
  }

  if (nutrition.protein_g !== undefined && nutrition.protein === undefined) {
    standardized.protein = nutrition.protein_g;
  } else if (nutrition.protein !== undefined && nutrition.protein_g === undefined) {
    standardized.protein_g = nutrition.protein;
  }

  if (nutrition.carbs_g !== undefined && nutrition.carbs === undefined) {
    standardized.carbs = nutrition.carbs_g;
  } else if (nutrition.carbs !== undefined && nutrition.carbs_g === undefined) {
    standardized.carbs_g = nutrition.carbs;
  }

  if (nutrition.fat_g !== undefined && nutrition.fat === undefined) {
    standardized.fat = nutrition.fat_g;
  } else if (nutrition.fat !== undefined && nutrition.fat_g === undefined) {
    standardized.fat_g = nutrition.fat;
  }

  if (nutrition.fiber_g !== undefined && nutrition.fiber === undefined) {
    standardized.fiber = nutrition.fiber_g;
  } else if (nutrition.fiber !== undefined && nutrition.fiber_g === undefined) {
    standardized.fiber_g = nutrition.fiber;
  }

  if (nutrition.sugar_g !== undefined && nutrition.sugar === undefined) {
    standardized.sugar = nutrition.sugar_g;
  } else if (nutrition.sugar !== undefined && nutrition.sugar_g === undefined) {
    standardized.sugar_g = nutrition.sugar;
  }

  if (nutrition.sodium_mg !== undefined && nutrition.sodium === undefined) {
    standardized.sodium = nutrition.sodium_mg;
  } else if (nutrition.sodium !== undefined && nutrition.sodium_mg === undefined) {
    standardized.sodium_mg = nutrition.sodium;
  }

  return standardized;
}

/**
 * Validates nutrition data to ensure it contains reasonable values
 */
export function validateNutritionData(nutrition: Partial<Nutrition> | null | undefined): boolean {
  if (!nutrition) return false;
  
  // Check if we have at least some basic nutrition data
  return (
    (nutrition.kcal !== undefined || nutrition.calories !== undefined) ||
    (nutrition.protein_g !== undefined || nutrition.protein !== undefined) ||
    (nutrition.carbs_g !== undefined || nutrition.carbs !== undefined) ||
    (nutrition.fat_g !== undefined || nutrition.fat !== undefined)
  );
}

/**
 * Creates an empty nutrition object with default zero values
 */
export function createEmptyNutrition(): Nutrition {
  return {
    kcal: 0,
    calories: 0,
    protein_g: 0,
    protein: 0,
    carbs_g: 0,
    carbs: 0,
    fat_g: 0,
    fat: 0,
    fiber_g: 0,
    fiber: 0,
    sugar_g: 0,
    sugar: 0,
    sodium_mg: 0,
    sodium: 0
  };
}

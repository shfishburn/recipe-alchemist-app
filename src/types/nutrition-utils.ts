
/**
 * This file provides utility functions for standardizing nutrition data across different formats
 */

import type { Nutrition } from '@/types/recipe';

export type NutritionData = Nutrition;

/**
 * Standardizes nutrition keys to ensure consistent naming across all recipe data
 */
export function standardizeNutrition(nutrition: NutritionData | any): Nutrition {
  if (!nutrition) return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0, 
    fiber: 0,
    sugar: 0,
    sodium: 0
  };
  
  const standardized: Nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    ...nutrition
  };
  
  // Map common alternate keys to standard keys
  const keyMappings: Record<string, string> = {
    // Calories
    'kcal': 'calories',
    
    // Macronutrients with units
    'protein_g': 'protein',
    'carbs_g': 'carbs',
    'carbohydrates': 'carbs',
    'carbohydrates_g': 'carbs',
    'fat_g': 'fat',
    'fiber_g': 'fiber',
    'sugar_g': 'sugar',
    'sodium_mg': 'sodium',
    
    // Vitamins with and without units
    'vitamin_a': 'vitaminA',
    'vitamin_c': 'vitaminC',
    'vitamin_d': 'vitaminD',
    'vitamin_a_iu': 'vitaminA',
    'vitamin_c_mg': 'vitaminC',
    'vitamin_d_iu': 'vitaminD',
  };
  
  // Apply mappings
  for (const [alternate, standard] of Object.entries(keyMappings)) {
    if (nutrition[alternate] !== undefined && !standardized[standard as keyof Nutrition]) {
      (standardized as any)[standard] = nutrition[alternate];
    }
  }
  
  return standardized;
}

/**
 * Validates that nutrition data has the minimum required fields
 */
export function validateNutritionData(nutrition: any): boolean {
  if (!nutrition) return false;
  
  // Check for required fields
  const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
  const hasRequiredFields = requiredFields.every(field => {
    const value = nutrition[field];
    return value !== undefined && value !== null && !isNaN(parseFloat(value));
  });
  
  return hasRequiredFields;
}

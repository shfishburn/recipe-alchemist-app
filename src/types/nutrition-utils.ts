/**
 * Utility functions for working with nutrition data
 */

import { Nutrition } from '@/types/recipe';
import { ChangesResponse } from '@/types/chat';

// Standard nutrition field names to ensure consistency
export const NUTRITION_FIELD_NAMES = {
  calories: ['calories', 'kcal'],
  protein: ['protein', 'protein_g'],
  carbs: ['carbs', 'carbs_g'],
  fat: ['fat', 'fat_g'],
  fiber: ['fiber', 'fiber_g'],
  sugar: ['sugar', 'sugar_g'],
  sodium: ['sodium', 'sodium_mg']
};

/**
 * Get a standardized nutrition object from potentially inconsistent inputs
 */
export function standardizeNutrition(input: any): Nutrition {
  if (!input) return {};
  
  const output: Nutrition = {};
  
  // Map calories (priority to 'calories' field, fallback to 'kcal')
  if (input.calories !== undefined) {
    output.calories = Number(input.calories);
    output.kcal = Number(input.calories);
  } else if (input.kcal !== undefined) {
    output.calories = Number(input.kcal);
    output.kcal = Number(input.kcal);
  }
  
  // Map protein (priority to 'protein' field, fallback to 'protein_g')
  if (input.protein !== undefined) {
    output.protein = Number(input.protein);
    output.protein_g = Number(input.protein);
  } else if (input.protein_g !== undefined) {
    output.protein = Number(input.protein_g);
    output.protein_g = Number(input.protein_g);
  }
  
  // Map carbs (priority to 'carbs' field, fallback to 'carbs_g')
  if (input.carbs !== undefined) {
    output.carbs = Number(input.carbs);
    output.carbs_g = Number(input.carbs);
  } else if (input.carbs_g !== undefined) {
    output.carbs = Number(input.carbs_g);
    output.carbs_g = Number(input.carbs_g);
  }
  
  // Map fat (priority to 'fat' field, fallback to 'fat_g')
  if (input.fat !== undefined) {
    output.fat = Number(input.fat);
    output.fat_g = Number(input.fat);
  } else if (input.fat_g !== undefined) {
    output.fat = Number(input.fat_g);
    output.fat_g = Number(input.fat_g);
  }
  
  // Other nutrition fields (direct mapping)
  if (input.fiber !== undefined) output.fiber = Number(input.fiber);
  if (input.fiber_g !== undefined) output.fiber_g = Number(input.fiber_g);
  if (input.sugar !== undefined) output.sugar = Number(input.sugar);
  if (input.sugar_g !== undefined) output.sugar_g = Number(input.sugar_g);
  if (input.sodium !== undefined) output.sodium = Number(input.sodium);
  if (input.sodium_mg !== undefined) output.sodium_mg = Number(input.sodium_mg);
  
  return output;
}

/**
 * Validate nutrition data to ensure it contains required fields in correct format
 */
export function validateNutrition(nutrition: any): boolean {
  if (!nutrition || typeof nutrition !== 'object') return false;
  
  // Check if at least one valid nutrition field exists
  const hasCalories = nutrition.calories !== undefined || nutrition.kcal !== undefined;
  const hasProtein = nutrition.protein !== undefined || nutrition.protein_g !== undefined;
  const hasCarbs = nutrition.carbs !== undefined || nutrition.carbs_g !== undefined;
  const hasFat = nutrition.fat !== undefined || nutrition.fat_g !== undefined;
  
  // Basic validation: must have at least calories and one macronutrient
  return hasCalories && (hasProtein || hasCarbs || hasFat);
}

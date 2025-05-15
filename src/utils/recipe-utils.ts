
import { Nutrition } from '@/types/recipe';

/**
 * Standardizes nutrition data to ensure consistent format
 * @param data The raw nutrition data object
 * @returns A standardized Nutrition object
 */
export function standardizeNutrition(data: any): Nutrition {
  // Handle null or undefined data
  if (!data) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };
  }

  // Create base nutrition object with defaults
  const standardized: Nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  // Map values from various possible property names
  // Calories
  standardized.calories = data.calories || data.kcal || 0;
  // Protein
  standardized.protein = data.protein || data.protein_g || 0;
  // Carbs
  standardized.carbs = data.carbs || data.carbs_g || data.carbohydrates || 0;
  // Fat
  standardized.fat = data.fat || data.fat_g || 0;
  // Fiber
  standardized.fiber = data.fiber || data.fiber_g || 0;
  // Sugar
  standardized.sugar = data.sugar || data.sugar_g || 0;
  // Sodium
  standardized.sodium = data.sodium || data.sodium_mg || 0;

  // Copy any micronutrients that exist
  const micronutrients = ['vitamin_a', 'vitamin_c', 'vitamin_d', 'calcium', 'iron', 'potassium', 'cholesterol'];
  micronutrients.forEach(nutrient => {
    if (data[nutrient] !== undefined) {
      standardized[nutrient] = data[nutrient];
    }
  });

  // Handle alternative naming for micronutrients
  if (data.vitaminA !== undefined) standardized.vitamin_a = data.vitaminA;
  if (data.vitaminC !== undefined) standardized.vitamin_c = data.vitaminC;
  if (data.vitaminD !== undefined) standardized.vitamin_d = data.vitaminD;

  // Copy data quality information if it exists
  if (data.data_quality) {
    standardized.data_quality = { ...data.data_quality };
  }

  return standardized;
}

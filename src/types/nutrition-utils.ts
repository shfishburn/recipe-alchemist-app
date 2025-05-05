
/**
 * This file provides utility functions for standardizing nutrition data across different formats
 */

type NutritionData = {
  [key: string]: any;
};

/**
 * Standardizes nutrition keys to ensure consistent naming across all recipe data
 */
export function standardizeNutrition(nutrition: NutritionData): NutritionData {
  if (!nutrition) return {};
  
  const standardized: NutritionData = { ...nutrition };
  
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
    if (nutrition[alternate] !== undefined && nutrition[standard] === undefined) {
      standardized[standard] = nutrition[alternate];
    }
  }
  
  return standardized;
}

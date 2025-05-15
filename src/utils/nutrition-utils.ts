
/**
 * Standardizes nutrition data across different naming conventions
 * @param nutrition - The nutrition object to standardize
 * @returns A standardized nutrition object
 */
export function standardizeNutrition(nutrition: Record<string, any>): Record<string, any> {
  if (!nutrition || typeof nutrition !== 'object') {
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

  // Create a new object with standardized fields
  const standardized: Record<string, any> = {};

  // Map all possible field names to their standard names
  const fieldMappings = {
    // Basic nutrition - standard names
    calories: ['calories', 'kcal', 'energy'],
    protein: ['protein', 'protein_g'],
    carbs: ['carbs', 'carbs_g', 'carbohydrates', 'carbohydrates_g'],
    fat: ['fat', 'fat_g', 'total_fat', 'total_fat_g'],
    fiber: ['fiber', 'fiber_g', 'dietary_fiber', 'dietary_fiber_g'],
    sugar: ['sugar', 'sugar_g', 'sugars', 'sugars_g'],
    sodium: ['sodium', 'sodium_mg'],

    // Micronutrients
    vitaminA: ['vitamin_a', 'vitaminA', 'vitamin_a_iu'],
    vitaminC: ['vitamin_c', 'vitaminC', 'vitamin_c_mg'],
    vitaminD: ['vitamin_d', 'vitaminD', 'vitamin_d_iu'],
    calcium: ['calcium', 'calcium_mg'],
    iron: ['iron', 'iron_mg'],
    potassium: ['potassium', 'potassium_mg'],
    cholesterol: ['cholesterol', 'cholesterol_mg']
  };

  // For each standard field, find the first matching field in the nutrition object
  for (const [standardField, possibleFields] of Object.entries(fieldMappings)) {
    for (const field of possibleFields) {
      if (nutrition[field] !== undefined && nutrition[field] !== null) {
        const value = parseFloat(nutrition[field]);
        standardized[standardField] = isNaN(value) ? 0 : value;
        break;
      }
    }

    // If no match was found, set a default value of 0
    if (standardized[standardField] === undefined) {
      standardized[standardField] = 0;
    }
  }

  // Preserve any data quality information
  if (nutrition.data_quality) {
    standardized.data_quality = nutrition.data_quality;
  }

  return standardized;
}

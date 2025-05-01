
// Define the daily reference values for nutrients
export const DAILY_REFERENCE_VALUES = {
  calories: 2000,
  protein: 50, // g
  carbs: 275, // g
  fat: 78, // g
  fiber: 28, // g
  sugar: 50, // g
  sodium: 2300, // mg
  vitamin_a: 5000, // IU
  vitamin_c: 60, // mg
  vitamin_d: 400, // IU
  calcium: 1000, // mg
  iron: 18, // mg
  potassium: 4700 // mg
};

// Utility function to calculate percentage of daily value
export function getDailyValuePercentage(nutrient: string, value: number): number {
  const referenceValue = DAILY_REFERENCE_VALUES[nutrient as keyof typeof DAILY_REFERENCE_VALUES];
  if (!referenceValue || !value) return 0;
  
  return Math.round((value / referenceValue) * 100);
}

// Helper function to sanitize numeric values
function sanitizeNumber(value: any): number {
  if (value === undefined || value === null) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : Math.max(0, num); // Ensure non-negative values
}

// Function to standardize nutrition data to ensure consistent property access
export function standardizeNutrition(input: any) {
  if (!input || typeof input !== 'object') return {};
  
  console.log("Standardizing nutrition data:", input);
  
  const output: any = { ...input }; // Start with a copy of the input
  
  // Map calories (priority to 'calories' field, fallback to 'kcal')
  if (input.calories !== undefined) {
    output.calories = sanitizeNumber(input.calories);
    output.kcal = sanitizeNumber(input.calories);
  } else if (input.kcal !== undefined) {
    output.calories = sanitizeNumber(input.kcal);
    output.kcal = sanitizeNumber(input.kcal);
  } else {
    // Default minimum value
    output.calories = 1;
    output.kcal = 1;
  }
  
  // Map macronutrients with proper _g suffix
  if (input.protein !== undefined) {
    output.protein_g = sanitizeNumber(input.protein);
    output.protein = sanitizeNumber(input.protein);
  } else if (input.protein_g !== undefined) {
    output.protein_g = sanitizeNumber(input.protein_g);
    output.protein = sanitizeNumber(input.protein_g);
  } else {
    // Default minimum value
    output.protein = 0.1;
    output.protein_g = 0.1;
  }
  
  if (input.carbs !== undefined) {
    output.carbs_g = sanitizeNumber(input.carbs);
    output.carbs = sanitizeNumber(input.carbs);
  } else if (input.carbs_g !== undefined) {
    output.carbs_g = sanitizeNumber(input.carbs_g);
    output.carbs = sanitizeNumber(input.carbs_g);
  } else {
    // Default minimum value
    output.carbs = 0.1;
    output.carbs_g = 0.1;
  }
  
  if (input.fat !== undefined) {
    output.fat_g = sanitizeNumber(input.fat);
    output.fat = sanitizeNumber(input.fat);
  } else if (input.fat_g !== undefined) {
    output.fat_g = sanitizeNumber(input.fat_g);
    output.fat = sanitizeNumber(input.fat_g);
  } else {
    // Default minimum value
    output.fat = 0.1;
    output.fat_g = 0.1;
  }
  
  // Handle fiber with proper _g suffix
  if (input.fiber !== undefined) {
    output.fiber_g = sanitizeNumber(input.fiber);
    output.fiber = sanitizeNumber(input.fiber);
  } else if (input.fiber_g !== undefined) {
    output.fiber_g = sanitizeNumber(input.fiber_g);
    output.fiber = sanitizeNumber(input.fiber);
  } else if (input.dietary_fiber !== undefined) {
    // Additional field name that could be used
    output.fiber_g = sanitizeNumber(input.dietary_fiber);
    output.fiber = sanitizeNumber(input.dietary_fiber);
  }
  
  // Handle other nutrition fields with proper suffixes
  if (input.sugar_g !== undefined) output.sugar_g = sanitizeNumber(input.sugar_g);
  if (input.sugar !== undefined && output.sugar_g === undefined) output.sugar_g = sanitizeNumber(input.sugar);
  
  if (input.sodium_mg !== undefined) output.sodium_mg = sanitizeNumber(input.sodium_mg);
  if (input.sodium !== undefined && output.sodium_mg === undefined) output.sodium_mg = sanitizeNumber(input.sodium);
  
  // Map micronutrients
  if (input.vitamin_a_iu !== undefined) output.vitamin_a_iu = sanitizeNumber(input.vitamin_a_iu);
  if (input.vitaminA !== undefined && output.vitamin_a_iu === undefined) output.vitamin_a_iu = sanitizeNumber(input.vitaminA);
  if (input.vitamin_a !== undefined && output.vitamin_a_iu === undefined) output.vitamin_a_iu = sanitizeNumber(input.vitamin_a);
  
  if (input.vitamin_c_mg !== undefined) output.vitamin_c_mg = sanitizeNumber(input.vitamin_c_mg);
  if (input.vitaminC !== undefined && output.vitamin_c_mg === undefined) output.vitamin_c_mg = sanitizeNumber(input.vitaminC);
  if (input.vitamin_c !== undefined && output.vitamin_c_mg === undefined) output.vitamin_c_mg = sanitizeNumber(input.vitamin_c);
  
  if (input.vitamin_d_iu !== undefined) output.vitamin_d_iu = sanitizeNumber(input.vitamin_d_iu);
  if (input.vitaminD !== undefined && output.vitamin_d_iu === undefined) output.vitamin_d_iu = sanitizeNumber(input.vitaminD);
  if (input.vitamin_d !== undefined && output.vitamin_d_iu === undefined) output.vitamin_d_iu = sanitizeNumber(input.vitamin_d);
  
  if (input.calcium_mg !== undefined) output.calcium_mg = sanitizeNumber(input.calcium_mg);
  if (input.calcium !== undefined && output.calcium_mg === undefined) output.calcium_mg = sanitizeNumber(input.calcium);
  
  if (input.iron_mg !== undefined) output.iron_mg = sanitizeNumber(input.iron_mg);
  if (input.iron !== undefined && output.iron_mg === undefined) output.iron_mg = sanitizeNumber(input.iron);
  
  if (input.potassium_mg !== undefined) output.potassium_mg = sanitizeNumber(input.potassium_mg);
  if (input.potassium !== undefined && output.potassium_mg === undefined) output.potassium_mg = sanitizeNumber(input.potassium);
  
  // Preserve metadata
  if (input.data_quality) output.data_quality = input.data_quality;
  if (input.per_ingredient) output.per_ingredient = input.per_ingredient;
  if (input.audit_log) output.audit_log = input.audit_log;
  
  console.log("Standardized nutrition data:", output);
  return output;
}

// Validate if nutrition data has at least basic information
export function validateNutrition(nutrition: any): boolean {
  if (!nutrition || typeof nutrition !== 'object') return false;
  
  // Check if at least one valid nutrition field exists
  const hasCalories = (nutrition.calories !== undefined && nutrition.calories > 0) || 
                     (nutrition.kcal !== undefined && nutrition.kcal > 0);
  const hasProtein = (nutrition.protein_g !== undefined && nutrition.protein_g > 0) || 
                     (nutrition.protein !== undefined && nutrition.protein > 0);
  const hasCarbs = (nutrition.carbs_g !== undefined && nutrition.carbs_g > 0) || 
                   (nutrition.carbs !== undefined && nutrition.carbs > 0);
  const hasFat = (nutrition.fat_g !== undefined && nutrition.fat_g > 0) || 
                 (nutrition.fat !== undefined && nutrition.fat > 0);
  
  // Basic validation: must have at least calories and one macronutrient
  return hasCalories && (hasProtein || hasCarbs || hasFat);
}


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

// Function to standardize nutrition data to ensure consistent property access
export function standardizeNutrition(input: any) {
  if (!input || typeof input !== 'object') return {};
  
  const output: any = { ...input }; // Start with a copy of the input
  
  // Map calories (priority to 'calories' field, fallback to 'kcal')
  if (input.calories !== undefined) {
    output.calories = Number(input.calories);
    output.kcal = Number(input.calories);
  } else if (input.kcal !== undefined) {
    output.calories = Number(input.kcal);
    output.kcal = Number(input.kcal);
  }
  
  // Map macronutrients with proper _g suffix
  if (input.protein !== undefined) {
    output.protein_g = Number(input.protein);
    output.protein = Number(input.protein);
  } else if (input.protein_g !== undefined) {
    output.protein_g = Number(input.protein_g);
    output.protein = Number(input.protein_g);
  }
  
  if (input.carbs !== undefined) {
    output.carbs_g = Number(input.carbs);
    output.carbs = Number(input.carbs);
  } else if (input.carbs_g !== undefined) {
    output.carbs_g = Number(input.carbs_g);
    output.carbs = Number(input.carbs_g);
  }
  
  if (input.fat !== undefined) {
    output.fat_g = Number(input.fat);
    output.fat = Number(input.fat);
  } else if (input.fat_g !== undefined) {
    output.fat_g = Number(input.fat_g);
    output.fat = Number(input.fat_g);
  }
  
  // Handle fiber with proper _g suffix
  if (input.fiber !== undefined) {
    output.fiber_g = Number(input.fiber);
    output.fiber = Number(input.fiber);
  } else if (input.fiber_g !== undefined) {
    output.fiber_g = Number(input.fiber_g);
    output.fiber = Number(input.fiber);
  } else if (input.dietary_fiber !== undefined) {
    // Additional field name that could be used
    output.fiber_g = Number(input.dietary_fiber);
    output.fiber = Number(input.dietary_fiber);
  }
  
  // Handle other nutrition fields with proper suffixes
  if (input.sugar_g !== undefined) output.sugar_g = Number(input.sugar_g);
  if (input.sugar !== undefined && output.sugar_g === undefined) output.sugar_g = Number(input.sugar);
  
  if (input.sodium_mg !== undefined) output.sodium_mg = Number(input.sodium_mg);
  if (input.sodium !== undefined && output.sodium_mg === undefined) output.sodium_mg = Number(input.sodium);
  
  // Map micronutrients
  if (input.vitamin_a_iu !== undefined) output.vitamin_a_iu = Number(input.vitamin_a_iu);
  if (input.vitaminA !== undefined && output.vitamin_a_iu === undefined) output.vitamin_a_iu = Number(input.vitaminA);
  if (input.vitamin_a !== undefined && output.vitamin_a_iu === undefined) output.vitamin_a_iu = Number(input.vitamin_a);
  
  if (input.vitamin_c_mg !== undefined) output.vitamin_c_mg = Number(input.vitamin_c_mg);
  if (input.vitaminC !== undefined && output.vitamin_c_mg === undefined) output.vitamin_c_mg = Number(input.vitaminC);
  if (input.vitamin_c !== undefined && output.vitamin_c_mg === undefined) output.vitamin_c_mg = Number(input.vitamin_c);
  
  if (input.vitamin_d_iu !== undefined) output.vitamin_d_iu = Number(input.vitamin_d_iu);
  if (input.vitaminD !== undefined && output.vitamin_d_iu === undefined) output.vitamin_d_iu = Number(input.vitaminD);
  if (input.vitamin_d !== undefined && output.vitamin_d_iu === undefined) output.vitamin_d_iu = Number(input.vitamin_d);
  
  if (input.calcium_mg !== undefined) output.calcium_mg = Number(input.calcium_mg);
  if (input.calcium !== undefined && output.calcium_mg === undefined) output.calcium_mg = Number(input.calcium);
  
  if (input.iron_mg !== undefined) output.iron_mg = Number(input.iron_mg);
  if (input.iron !== undefined && output.iron_mg === undefined) output.iron_mg = Number(input.iron);
  
  if (input.potassium_mg !== undefined) output.potassium_mg = Number(input.potassium_mg);
  if (input.potassium !== undefined && output.potassium_mg === undefined) output.potassium_mg = Number(input.potassium);
  
  // If we have any "data_quality" info, preserve it
  if (input.data_quality) {
    output.data_quality = input.data_quality;
  }
  
  // If we have per-ingredient breakdowns, preserve that data
  if (input.per_ingredient) {
    output.per_ingredient = input.per_ingredient;
  }
  
  // If we have audit logs, preserve them
  if (input.audit_log) {
    output.audit_log = input.audit_log;
  }
  
  return output;
}

// This file has a type error we need to fix
// The error is that we're trying to assign a number to a complex type

export type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  calcium: number;
  iron: number;
  potassium: number;
  vitamin_d: number;
  vitamin_c: number;
  vitamin_a: number;
  // Allow for aliased properties
  carbs?: number;  // Alternative to carbohydrates
  
  // Legacy property aliases for backward compatibility
  kcal?: number;
  protein_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  potassium_mg?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitamin_a_iu?: number;
  vitamin_c_mg?: number;
  vitamin_d_iu?: number;
  
  // Enhanced properties for extended nutrition data
  data_quality?: NutritionDataQuality;
  per_ingredient?: Record<string, any>;
  audit_log?: any[];
};

export type NutritionTotals = {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  calcium: number;
  iron: number;
  potassium: number;
  vitamin_d: number;
  vitamin_c: number;
  vitamin_a: number;
  // Add more nutrients as needed
};

export type NutritionDataQualitySummary = {
  overall_confidence: 'high' | 'medium' | 'low';
  overall_confidence_score: number;
  penalties: Record<string, any>;
  unmatched_or_low_confidence_ingredients: string[];
  limitations: string[];
};

export type NutritionDataQuality = {
  overall_confidence: 'high' | 'medium' | 'low';
  overall_confidence_score: number;
  penalties: Record<string, any>;
  unmatched_or_low_confidence_ingredients: string[];
  limitations: string[];
  // Add the recommended_macros property to fix the type error
  recommended_macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
} & Record<string, any>;

export type ExtendedNutritionData = Nutrition & {
  data_quality?: NutritionDataQuality;
  per_ingredient?: Record<string, any>;
  audit_log?: any[];
  // Legacy property aliases
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  potassium_mg?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitamin_a_iu?: number;
  vitamin_c_mg?: number;
  vitamin_d_iu?: number;
};

export type NutritionResponse = {
  nutrition: Nutrition | ExtendedNutritionData;
  data_quality: NutritionDataQuality;
  total: NutritionTotals;
};

// Add these exported functions to fix build errors
export const standardizeNutrition = (nutrition: any): Nutrition => {
  if (!nutrition) return {
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    vitamin_d: 0,
    vitamin_c: 0,
    vitamin_a: 0,
    carbs: 0,
  };

  return {
    calories: nutrition?.calories || nutrition?.kcal || 0,
    protein: nutrition?.protein || nutrition?.protein_g || 0,
    fat: nutrition?.fat || nutrition?.fat_g || 0,
    carbohydrates: nutrition?.carbohydrates || nutrition?.carbs || nutrition?.carbs_g || 0,
    fiber: nutrition?.fiber || nutrition?.fiber_g || 0,
    sugar: nutrition?.sugar || nutrition?.sugar_g || 0,
    sodium: nutrition?.sodium || nutrition?.sodium_mg || 0,
    cholesterol: nutrition?.cholesterol || 0,
    calcium: nutrition?.calcium || nutrition?.calcium_mg || 0,
    iron: nutrition?.iron || nutrition?.iron_mg || 0,
    potassium: nutrition?.potassium || nutrition?.potassium_mg || 0,
    vitamin_d: nutrition?.vitamin_d || nutrition?.vitaminD || nutrition?.vitamin_d_iu || 0,
    vitamin_c: nutrition?.vitamin_c || nutrition?.vitaminC || nutrition?.vitamin_c_mg || 0,
    vitamin_a: nutrition?.vitamin_a || nutrition?.vitaminA || nutrition?.vitamin_a_iu || 0,
    // Add carbs alias for compatibility
    carbs: nutrition?.carbohydrates || nutrition?.carbs || nutrition?.carbs_g || 0,
    // Include extended fields if present
    data_quality: nutrition?.data_quality,
    per_ingredient: nutrition?.per_ingredient,
    audit_log: nutrition?.audit_log,
    // Include legacy aliases for compatibility
    kcal: nutrition?.calories || nutrition?.kcal || 0,
    protein_g: nutrition?.protein || nutrition?.protein_g || 0,
    fat_g: nutrition?.fat || nutrition?.fat_g || 0,
    fiber_g: nutrition?.fiber || nutrition?.fiber_g || 0,
    sugar_g: nutrition?.sugar || nutrition?.sugar_g || 0,
    sodium_mg: nutrition?.sodium || nutrition?.sodium_mg || 0,
    calcium_mg: nutrition?.calcium || nutrition?.calcium_mg || 0,
    iron_mg: nutrition?.iron || nutrition?.iron_mg || 0,
    potassium_mg: nutrition?.potassium || nutrition?.potassium_mg || 0,
    vitaminA: nutrition?.vitamin_a || nutrition?.vitaminA || nutrition?.vitamin_a_iu || 0,
    vitaminC: nutrition?.vitamin_c || nutrition?.vitaminC || nutrition?.vitamin_c_mg || 0,
    vitaminD: nutrition?.vitamin_d || nutrition?.vitaminD || nutrition?.vitamin_d_iu || 0,
    vitamin_a_iu: nutrition?.vitamin_a || nutrition?.vitaminA || nutrition?.vitamin_a_iu || 0,
    vitamin_c_mg: nutrition?.vitamin_c || nutrition?.vitaminC || nutrition?.vitamin_c_mg || 0,
    vitamin_d_iu: nutrition?.vitamin_d || nutrition?.vitaminD || nutrition?.vitamin_d_iu || 0,
  };
};

// Add validateNutritionData that was missing
export const validateNutritionData = (nutrition: any): boolean => {
  if (!nutrition) return false;
  
  // Check for essential macronutrients
  const hasCalories = nutrition.calories !== undefined || nutrition.kcal !== undefined;
  const hasProtein = nutrition.protein !== undefined || nutrition.protein_g !== undefined;
  const hasFat = nutrition.fat !== undefined || nutrition.fat_g !== undefined;
  const hasCarbs = 
    nutrition.carbohydrates !== undefined || 
    nutrition.carbs !== undefined || 
    nutrition.carbs_g !== undefined;
    
  return hasCalories && (hasProtein || hasFat || hasCarbs);
};

export const DAILY_REFERENCE_VALUES = {
  calories: 2000,
  protein: 50,
  fat: 78,
  carbohydrates: 275,
  fiber: 28,
  sugar: 50,
  sodium: 2300,
  cholesterol: 300,
  calcium: 1300,
  iron: 18,
  potassium: 4700,
  vitamin_d: 20,
  vitamin_c: 90,
  vitamin_a: 900,
};

export const getDailyValuePercentage = (nutrient: string, amount: number): number => {
  const reference = DAILY_REFERENCE_VALUES[nutrient as keyof typeof DAILY_REFERENCE_VALUES];
  if (!reference) return 0;
  return (amount / reference) * 100;
};

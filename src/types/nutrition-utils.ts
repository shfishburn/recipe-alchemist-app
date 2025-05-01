
// This file has a type error we need to fix
// The error is that we're trying to assign a number to a complex type
// We'll update the typing to fix this issue

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
  // Add more nutrients as needed
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

// Make sure data_quality is compatible with the required type
export type NutritionDataQuality = {
  overall_confidence: 'high' | 'medium' | 'low';
  overall_confidence_score: number;
  penalties: Record<string, any>;
  unmatched_or_low_confidence_ingredients: string[];
  limitations: string[];
} & Record<string, any>;

export type NutritionResponse = {
  nutrition: Nutrition;
  data_quality: NutritionDataQuality;
  total: NutritionTotals;
};

// Add these exported functions to fix build errors
export const standardizeNutrition = (nutrition: any): Nutrition => {
  return {
    calories: nutrition?.calories || 0,
    protein: nutrition?.protein || 0,
    fat: nutrition?.fat || 0,
    carbohydrates: nutrition?.carbohydrates || 0,
    fiber: nutrition?.fiber || 0,
    sugar: nutrition?.sugar || 0,
    sodium: nutrition?.sodium || 0,
    cholesterol: nutrition?.cholesterol || 0,
    calcium: nutrition?.calcium || 0,
    iron: nutrition?.iron || 0,
    potassium: nutrition?.potassium || 0,
    vitamin_d: nutrition?.vitamin_d || 0,
    vitamin_c: nutrition?.vitamin_c || 0,
    vitamin_a: nutrition?.vitamin_a || 0,
  };
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

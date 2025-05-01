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

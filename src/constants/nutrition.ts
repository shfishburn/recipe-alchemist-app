
// This file contains constants used by the nutrition components

// Reference values for daily nutrition intake (based on a 2000 calorie diet)
export const DAILY_REFERENCE_VALUES = {
  calories: 2000,
  protein: 50, // g
  carbs: 275, // g
  fat: 78, // g
  fiber: 28, // g
  sugar: 50, // g
  sodium: 2300, // mg
  saturated_fat: 20, // g
  cholesterol: 300, // mg
  potassium: 4700, // mg
  calcium: 1000, // mg
  iron: 18, // mg
  vitaminA: 900, // mcg RAE
  vitaminC: 90, // mg
  vitaminD: 20, // mcg
};

// Colors for nutrition visualization
export const NUTRITION_COLORS = {
  proteinBg: "rgb(59, 130, 246, 0.9)", // Blue
  carbsBg: "rgb(16, 185, 129, 0.9)", // Green
  fatBg: "rgb(245, 158, 11, 0.9)", // Amber
  fiberBg: "rgb(168, 85, 247, 0.9)", // Purple
  satFatBg: "rgb(239, 68, 68, 0.9)", // Red
  sugarBg: "rgb(249, 115, 22, 0.9)", // Orange
  sodiumBg: "rgb(236, 72, 153, 0.9)", // Pink
};

// Unit conversion factors for imperial/metric
export const UNIT_CONVERSION = {
  g_to_oz: 0.035274, // 1 gram = 0.035274 ounces
  oz_to_g: 28.3495, // 1 ounce = 28.3495 grams
  mg_to_grain: 0.0154, // 1 mg = 0.0154 grain
  grain_to_mg: 64.799, // 1 grain = 64.799 mg
};

// Standard cutoffs for nutrition quality assessment
export const NUTRITION_QUALITY_THRESHOLDS = {
  protein: {
    low: 10, // g
    medium: 20, // g
    high: 30, // g
  },
  fiber: {
    low: 3, // g
    medium: 6, // g
    high: 10, // g
  },
  saturated_fat: {
    low: 3, // g
    medium: 10, // g
    high: 15, // g
  },
  sodium: {
    low: 500, // mg
    medium: 1000, // mg
    high: 2000, // mg
  },
  sugar: {
    low: 5, // g
    medium: 15, // g
    high: 25, // g
  },
};

// NutriScore categories
export const NUTRI_SCORE_CATEGORIES = {
  A: "Excellent nutritional quality",
  B: "Good nutritional quality",
  C: "Average nutritional quality",
  D: "Poor nutritional quality",
  E: "Very poor nutritional quality",
};

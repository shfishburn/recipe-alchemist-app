
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
  
  // Add color properties for direct access (without Bg suffix)
  protein: "rgb(59, 130, 246, 0.9)", 
  carbs: "rgb(16, 185, 129, 0.9)", 
  fat: "rgb(245, 158, 11, 0.9)", 
  fiber: "rgb(168, 85, 247, 0.9)",
  saturated_fat: "rgb(239, 68, 68, 0.9)",
  sugar: "rgb(249, 115, 22, 0.9)",
  sodium: "rgb(236, 72, 153, 0.9)",
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

// Nutrient descriptions for tooltip information
export const NUTRIENT_DESCRIPTIONS = {
  vitaminA: "Important for vision, immune function, and cell growth",
  vitaminC: "Helps with immune function and acts as an antioxidant",
  vitaminD: "Essential for bone health and immune function",
  calcium: "Important for bone health, muscle function, and nerve signaling",
  iron: "Essential for red blood cell production and oxygen transport",
  potassium: "Helps regulate fluid balance, muscle contractions and nerve signals",
  sodium: "Helps maintain fluid balance and is needed for nerve and muscle function",
  fiber: "Aids digestion, helps maintain bowel health, and lowers cholesterol",
  sugar: "Provides quick energy but should be consumed in moderation",
  cholesterol: "Used to make hormones and vitamin D, but high levels can increase heart disease risk",
  saturatedfat: "Type of fat that can raise cholesterol and increase heart disease risk",
  protein: "Essential for building and repairing tissues and making enzymes and hormones",
  carbs: "Main source of energy for the body and brain",
  fat: "Important for energy, cell growth, and hormone production"
};

// Display names for nutrients
export const NUTRIENT_DISPLAY_NAMES = {
  vitaminA: "Vitamin A",
  vitaminC: "Vitamin C",
  vitaminD: "Vitamin D",
  calcium: "Calcium",
  iron: "Iron",
  potassium: "Potassium",
  sodium: "Sodium",
  fiber: "Fiber",
  sugar: "Sugar",
  cholesterol: "Cholesterol",
  saturatedfat: "Saturated Fat",
  protein: "Protein",
  carbs: "Carbohydrates",
  fat: "Fat"
};

// Standard units for nutrients
export const NUTRIENT_UNITS = {
  vitaminA: "mcg",
  vitaminC: "mg",
  vitaminD: "mcg",
  calcium: "mg",
  iron: "mg",
  potassium: "mg",
  sodium: "mg",
  fiber: "g",
  sugar: "g",
  cholesterol: "mg",
  saturatedfat: "g",
  protein: "g",
  carbs: "g",
  fat: "g"
};

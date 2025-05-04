
/**
 * Color constants for nutrition visualization
 */
export const NUTRITION_COLORS = {
  // Primary macro colors
  protein: '#9b87f5', // Purple
  carbs: '#0EA5E9',   // Blue
  fat: '#22c55e',     // Green
  fiber: '#fb923c',   // Orange
  calories: '#ef4444', // Red

  // Background colors for progress bars (with opacity)
  proteinBg: 'rgba(155, 135, 245, 0.9)',
  carbsBg: 'rgba(14, 165, 233, 0.9)',
  fatBg: 'rgba(34, 197, 94, 0.9)',
  fiberBg: 'rgba(251, 146, 60, 0.9)',
  caloriesBg: 'rgba(239, 68, 68, 0.9)',

  // Supporting colors for micro-nutrients
  vitaminA: '#f59e0b',
  vitaminC: '#10b981',
  vitaminD: '#8b5cf6',
  calcium: '#06b6d4',
  iron: '#ef4444',
  potassium: '#f97316',
  sodium: '#f43f5e',
  sugar: '#ec4899',
};

/**
 * Daily reference values based on FDA guidelines
 * Using 2000 calorie diet as reference
 */
export const DAILY_REFERENCE_VALUES = {
  calories: 2000,
  protein: 50,    // g
  carbs: 275,     // g
  fat: 78,        // g
  fiber: 28,      // g
  sugar: 50,      // g
  sodium: 2300,   // mg
  calcium: 1300,  // mg
  iron: 18,       // mg
  potassium: 4700,// mg
  vitaminA: 900,  // mcg RAE
  vitaminC: 90,   // mg
  vitaminD: 20,   // mcg
};

/**
 * Nutrition quality level definitions
 */
export const NUTRITION_QUALITY_LEVELS = {
  high: 0.8,
  medium: 0.6,
  low: 0.4
};

/**
 * Nutrient descriptions for tooltips and explanations
 */
export const NUTRIENT_DESCRIPTIONS = {
  protein: 'Essential for building and repairing muscle tissue and supporting immune function',
  carbs: 'Primary source of energy for the body and brain',
  fat: 'Necessary for hormone production, vitamin absorption, and cell membrane integrity',
  fiber: 'Supports digestive health and helps regulate blood sugar and cholesterol levels',
  calories: 'Unit of energy - daily needs vary based on age, gender, weight, and activity level',
  sodium: 'Electrolyte that helps maintain fluid balance and supports muscle and nerve function',
  calcium: 'Essential for bone health, muscle contraction, and nerve transmission',
  iron: 'Needed for red blood cell production and oxygen transport throughout the body',
  potassium: 'Electrolyte that helps regulate fluid balance, muscle contractions, and nerve signals',
  vitaminA: 'Important for vision, immune function, and cell growth',
  vitaminC: 'Antioxidant that supports immune function and collagen production',
  vitaminD: 'Helps absorb calcium and promotes bone health',
  sugar: 'Simple carbohydrates that provide quick energy but should be consumed in moderation'
};

/**
 * Display names for nutrients (for UI presentation)
 */
export const NUTRIENT_DISPLAY_NAMES = {
  protein: 'Protein',
  carbs: 'Carbohydrates',
  fat: 'Fat',
  fiber: 'Dietary Fiber',
  calories: 'Calories',
  sodium: 'Sodium',
  calcium: 'Calcium',
  iron: 'Iron',
  potassium: 'Potassium',
  vitaminA: 'Vitamin A',
  vitaminC: 'Vitamin C',
  vitaminD: 'Vitamin D',
  sugar: 'Sugar'
};

/**
 * Units for each nutrient
 */
export const NUTRIENT_UNITS = {
  protein: 'g',
  carbs: 'g',
  fat: 'g',
  fiber: 'g',
  calories: 'kcal',
  sodium: 'mg',
  calcium: 'mg',
  iron: 'mg',
  potassium: 'mg',
  vitaminA: 'μg RAE',
  vitaminC: 'mg',
  vitaminD: 'μg',
  sugar: 'g'
};


/**
 * Color constants for nutrition visualization
 */
export const NUTRITION_COLORS = {
  // Primary macro colors
  protein: '#9b87f5', // Purple
  carbs: '#0EA5E9',   // Blue
  fat: '#22c55e',     // Green
  fiber: '#fb923c',   // Orange

  // Background colors for progress bars (with opacity)
  proteinBg: 'rgba(155, 135, 245, 0.9)',
  carbsBg: 'rgba(14, 165, 233, 0.9)',
  fatBg: 'rgba(34, 197, 94, 0.9)',
  fiberBg: 'rgba(251, 146, 60, 0.9)',

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

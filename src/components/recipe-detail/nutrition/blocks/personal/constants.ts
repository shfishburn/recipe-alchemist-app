
export const NUTRITION_COLORS = {
  protein: '#4f46e5', // indigo
  carbs: '#f59e0b',   // amber
  fat: '#10b981',     // emerald
  fiber: '#6366f1',   // violet
  calories: '#ef4444' // red
};

export const NUTRIENT_INFO = {
  calories: {
    name: 'Calories',
    description: 'Energy from food measured in kilocalories (kcal)',
    unit: 'kcal',
    dailyValue: 2000,
    caloriesPerGram: 4 // Added for calculations
  },
  protein: {
    name: 'Protein',
    description: 'Essential for building and repairing tissue',
    unit: 'g',
    dailyValue: 50,
    caloriesPerGram: 4
  },
  carbs: {
    name: 'Carbohydrates',
    description: 'Primary source of energy for the body',
    unit: 'g',
    dailyValue: 275,
    caloriesPerGram: 4
  },
  fat: {
    name: 'Fat',
    description: 'Important for hormone production and nutrient absorption',
    unit: 'g',
    dailyValue: 78,
    caloriesPerGram: 9
  },
  fiber: {
    name: 'Fiber',
    description: 'Aids digestion and helps maintain gut health',
    unit: 'g',
    dailyValue: 28,
    caloriesPerGram: 0 // Fiber doesn't contribute calories directly
  }
};

// Helper functions to identify nutrient types
export const isMacroNutrient = (nutrient: string): boolean => {
  return ['protein', 'carbs', 'fat'].includes(nutrient);
};

export const isMicroNutrient = (nutrient: string): boolean => {
  return !['protein', 'carbs', 'fat', 'calories', 'fiber'].includes(nutrient);
};

// Define nutrient categories for organization
export const NUTRIENT_CATEGORIES = {
  macros: ['protein', 'carbs', 'fat'],
  energy: ['calories'],
  fiber: ['fiber'],
  vitamins: ['vitamin_a', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'vitamin_k'],
  minerals: ['calcium', 'iron', 'magnesium', 'potassium', 'zinc']
};

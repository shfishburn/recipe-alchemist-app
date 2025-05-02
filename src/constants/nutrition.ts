
/**
 * Standard daily reference values for nutrients based on a 2000 calorie diet
 * Values sourced from U.S. Dietary Reference Intakes for adults 18-75
 */
export const DAILY_REFERENCE_VALUES = {
  // Macronutrients
  calories: 2000,
  protein: 50, // g
  carbs: 275,  // g
  fat: 78,     // g
  fiber: 28,   // g
  sugar: 50,   // g
  
  // Minerals
  sodium: 1500, // mg (based on AI for adults 18-50)
  potassium: 3400, // mg (based on AI for adult males)
  calcium: 1000, // mg (for adults 18-50)
  phosphorus: 700, // mg
  magnesium: 420, // mg (for adult males 31+)
  iron: 18, // mg (higher value for menstruating females)
  zinc: 11, // mg (for adult males)
  selenium: 55, // μg
  iodine: 150, // μg
  copper: 900, // μg
  manganese: 2.3, // mg
  chromium: 35, // μg (for adult males 18-50)
  molybdenum: 45, // μg
  
  // Vitamins
  vitaminA: 900, // μg RAE (for adult males)
  vitaminC: 90, // mg (for adult males)
  vitaminD: 20, // μg (800 IU, higher value for 71+)
  vitaminE: 15, // mg
  vitaminK: 120, // μg (for adult males)
  thiamin: 1.2, // mg (for adult males)
  riboflavin: 1.3, // mg (for adult males)
  niacin: 16, // mg (for adult males)
  vitaminB6: 1.7, // mg (for adult males 51+)
  folate: 400, // μg DFE
  vitaminB12: 2.4, // μg
  pantothenicAcid: 5, // mg
  biotin: 30, // μg
  choline: 550, // mg (for adult males)
  
  // More generic categories for backwards compatibility
  vitamins: {
    a: 900, // μg RAE
    c: 90, // mg
    d: 20, // μg
    e: 15, // mg
    k: 120, // μg
    b1: 1.2, // mg (thiamin)
    b2: 1.3, // mg (riboflavin)
    b3: 16, // mg (niacin)
    b5: 5, // mg (pantothenic acid)
    b6: 1.7, // mg
    b7: 30, // μg (biotin)
    b9: 400, // μg (folate)
    b12: 2.4, // μg
  },
  
  minerals: {
    calcium: 1000, // mg
    iron: 18, // mg
    phosphorus: 700, // mg
    magnesium: 420, // mg
    zinc: 11, // mg
    selenium: 55, // μg
    copper: 900, // μg
    manganese: 2.3, // mg
    chromium: 35, // μg
    iodine: 150, // μg
    potassium: 3400, // mg
    sodium: 1500, // mg
    chloride: 2300, // mg
  }
};

/**
 * Tolerable Upper Intake Levels (UL) - maximum daily intake unlikely to cause adverse health effects
 */
export const UPPER_INTAKE_LEVELS = {
  vitaminA: 3000, // μg (preformed)
  vitaminC: 2000, // mg
  vitaminD: 100, // μg (4000 IU)
  vitaminE: 1000, // mg
  niacin: 35, // mg
  vitaminB6: 100, // mg
  folate: 1000, // μg (from supplements)
  calcium: 2500, // mg
  iron: 45, // mg
  phosphorus: 4000, // mg
  magnesium: 350, // mg (from supplements)
  zinc: 40, // mg
  selenium: 400, // μg
  copper: 10000, // μg
  manganese: 11, // mg
  iodine: 1100, // μg
};

/**
 * Common nutrient units for reference
 */
export const NUTRIENT_UNITS = {
  // Macronutrients
  calories: 'kcal',
  protein: 'g',
  carbs: 'g',
  fat: 'g',
  fiber: 'g',
  sugar: 'g',
  
  // Minerals
  sodium: 'mg',
  potassium: 'mg',
  calcium: 'mg',
  phosphorus: 'mg',
  magnesium: 'mg',
  iron: 'mg',
  zinc: 'mg',
  selenium: 'μg',
  iodine: 'μg',
  copper: 'μg',
  manganese: 'mg',
  chromium: 'μg',
  molybdenum: 'μg',
  
  // Vitamins
  vitaminA: 'μg RAE',
  vitaminC: 'mg',
  vitaminD: 'μg',
  vitaminE: 'mg',
  vitaminK: 'μg',
  thiamin: 'mg',
  riboflavin: 'mg',
  niacin: 'mg',
  vitaminB6: 'mg',
  folate: 'μg DFE',
  vitaminB12: 'μg',
  pantothenicAcid: 'mg',
  biotin: 'μg',
  choline: 'mg',
};

/**
 * Color coding for nutrition display
 */
export const NUTRITION_COLORS = {
  protein: '#4f46e5', // indigo
  carbs: '#f59e0b',   // amber
  fat: '#10b981',     // emerald
  fiber: '#6366f1',   // violet
  calories: '#ef4444', // red
  
  // Additional colors for micronutrients
  vitamins: '#8b5cf6',   // purple
  minerals: '#0ea5e9',   // sky blue
  antioxidants: '#14b8a6' // teal
};

/**
 * Nutrient categories for display grouping
 */
export const NUTRIENT_CATEGORIES = {
  macronutrients: ['protein', 'carbs', 'fat', 'fiber', 'sugar'],
  vitamins: [
    'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK',
    'thiamin', 'riboflavin', 'niacin', 'vitaminB6', 'folate', 
    'vitaminB12', 'pantothenicAcid', 'biotin', 'choline'
  ],
  minerals: [
    'calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 
    'sodium', 'zinc', 'selenium', 'copper', 'manganese', 
    'chromium', 'molybdenum', 'iodine'
  ]
};

/**
 * Display names for nutrients (for UI presentation)
 */
export const NUTRIENT_DISPLAY_NAMES = {
  calories: 'Calories',
  protein: 'Protein',
  carbs: 'Carbohydrates',
  fat: 'Fat',
  fiber: 'Dietary Fiber',
  sugar: 'Sugars',
  
  vitaminA: 'Vitamin A',
  vitaminC: 'Vitamin C',
  vitaminD: 'Vitamin D',
  vitaminE: 'Vitamin E',
  vitaminK: 'Vitamin K',
  thiamin: 'Thiamin (B1)',
  riboflavin: 'Riboflavin (B2)',
  niacin: 'Niacin (B3)',
  vitaminB6: 'Vitamin B6',
  folate: 'Folate (B9)',
  vitaminB12: 'Vitamin B12',
  pantothenicAcid: 'Pantothenic Acid (B5)',
  biotin: 'Biotin (B7)',
  choline: 'Choline',
  
  calcium: 'Calcium',
  iron: 'Iron',
  phosphorus: 'Phosphorus',
  magnesium: 'Magnesium',
  zinc: 'Zinc',
  selenium: 'Selenium',
  copper: 'Copper',
  manganese: 'Manganese',
  chromium: 'Chromium',
  iodine: 'Iodine',
  potassium: 'Potassium',
  sodium: 'Sodium'
};

/**
 * Descriptions of nutrient functions in the body (for tooltips/info)
 */
export const NUTRIENT_DESCRIPTIONS = {
  vitaminA: 'Important for vision, immune function, and cell growth',
  vitaminC: 'Helps with immune function, collagen formation, and iron absorption',
  vitaminD: 'Essential for bone health, immune function, and calcium absorption',
  vitaminE: 'Antioxidant that protects cells from damage',
  vitaminK: 'Necessary for blood clotting and bone health',
  
  calcium: 'Essential for bone health, muscle function, and nerve signaling',
  iron: 'Needed for oxygen transport in the blood and energy production',
  potassium: 'Helps regulate fluid balance, nerve signals, and muscle contractions',
  sodium: 'Important for fluid balance and nerve function, but limit intake',
  magnesium: 'Involved in over 300 enzyme reactions, including energy production',
  
  fiber: 'Aids in digestion, helps you feel full, and supports gut health',
  protein: 'Essential for building and repairing tissues and making enzymes and hormones',
  carbs: 'Main source of energy for the body and brain',
  fat: 'Provides energy, supports cell growth, and helps absorb certain nutrients'
};

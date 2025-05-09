
// Constants related to nutrition data
export const NUTRITION_FIELD_NAMES = {
  calories: ['calories', 'kcal'],
  protein: ['protein_g', 'protein'],
  carbs: ['carbs_g', 'carbs'],
  fat: ['fat_g', 'fat'],
  fiber: ['fiber_g', 'fiber'],
  sugar: ['sugar_g', 'sugar'],
  sodium: ['sodium_mg', 'sodium'],
  // Micronutrients
  vitamin_a: ['vitamin_a_iu', 'vitaminA'],
  vitamin_c: ['vitamin_c_mg', 'vitaminC'],
  vitamin_d: ['vitamin_d_iu', 'vitaminD'],
  calcium: ['calcium_mg', 'calcium'],
  iron: ['iron_mg', 'iron'],
  potassium: ['potassium_mg', 'potassium']
};

// Daily reference values for nutrients
export const DAILY_REFERENCE_VALUES = {
  calories: 2000,     // kcal
  protein: 50,        // g
  carbs: 275,         // g 
  fat: 78,            // g
  fiber: 28,          // g
  sugar: 50,          // g (added sugars)
  sodium: 2300,       // mg
  vitamin_a: 5000,    // IU
  vitamin_c: 90,      // mg
  vitamin_d: 800,     // IU
  calcium: 1300,      // mg
  iron: 18,           // mg
  potassium: 4700     // mg
};

// Define CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

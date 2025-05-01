
import { Nutrition } from '@/types/recipe';

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

/**
 * Calculates percentage of daily value for a given nutrient
 */
export function getDailyValuePercentage(nutrient: string, value: number): number {
  if (!value || value <= 0 || isNaN(value)) return 0;
  
  // Get the reference value from our constants
  const referenceValue = DAILY_REFERENCE_VALUES[nutrient as keyof typeof DAILY_REFERENCE_VALUES];
  if (!referenceValue) return 0;
  
  // Calculate the percentage
  return Math.round((value / referenceValue) * 100);
}

/**
 * Standardizes nutrition data format by normalizing field names and ensuring numeric values
 */
export function standardizeNutrition(nutritionData: any): Nutrition {
  // Defensive copy to avoid modifying the original
  const nutrition: Nutrition = {...nutritionData};
  
  // Handle both naming conventions for core nutrients
  // Always use the shorter name version as the standard
  
  // Calories
  if (nutrition.kcal !== undefined && !isNaN(Number(nutrition.kcal))) {
    nutrition.calories = Number(nutrition.kcal);
  } else if (nutrition.calories === undefined || isNaN(Number(nutrition.calories))) {
    nutrition.calories = 0;
  } else {
    nutrition.calories = Number(nutrition.calories);
  }
  
  // Protein
  if (nutrition.protein_g !== undefined && !isNaN(Number(nutrition.protein_g))) {
    nutrition.protein = Number(nutrition.protein_g);
  } else if (nutrition.protein === undefined || isNaN(Number(nutrition.protein))) {
    nutrition.protein = 0;
  } else {
    nutrition.protein = Number(nutrition.protein);
  }
  
  // Carbs
  if (nutrition.carbs_g !== undefined && !isNaN(Number(nutrition.carbs_g))) {
    nutrition.carbs = Number(nutrition.carbs_g);
  } else if (nutrition.carbs === undefined || isNaN(Number(nutrition.carbs))) {
    nutrition.carbs = 0;
  } else {
    nutrition.carbs = Number(nutrition.carbs);
  }
  
  // Fat
  if (nutrition.fat_g !== undefined && !isNaN(Number(nutrition.fat_g))) {
    nutrition.fat = Number(nutrition.fat_g);
  } else if (nutrition.fat === undefined || isNaN(Number(nutrition.fat))) {
    nutrition.fat = 0;
  } else {
    nutrition.fat = Number(nutrition.fat);
  }
  
  // Fiber
  if (nutrition.fiber_g !== undefined && !isNaN(Number(nutrition.fiber_g))) {
    nutrition.fiber = Number(nutrition.fiber_g);
  } else if (nutrition.fiber === undefined || isNaN(Number(nutrition.fiber))) {
    nutrition.fiber = 0;
  } else {
    nutrition.fiber = Number(nutrition.fiber);
  }
  
  // Sugar
  if (nutrition.sugar_g !== undefined && !isNaN(Number(nutrition.sugar_g))) {
    nutrition.sugar_g = Number(nutrition.sugar_g);
  } else if (nutrition.sugar_g === undefined || isNaN(Number(nutrition.sugar_g))) {
    nutrition.sugar_g = 0;
  } else {
    nutrition.sugar_g = Number(nutrition.sugar_g);
  }
  
  // Sodium
  if (nutrition.sodium_mg !== undefined && !isNaN(Number(nutrition.sodium_mg))) {
    nutrition.sodium_mg = Number(nutrition.sodium_mg);
  } else if (nutrition.sodium_mg === undefined || isNaN(Number(nutrition.sodium_mg))) {
    nutrition.sodium_mg = 0;
  } else {
    nutrition.sodium_mg = Number(nutrition.sodium_mg);
  }
  
  // Standardize micronutrients
  standardizeMicronutrients(nutrition);
  
  // Ensure all values are non-negative
  Object.keys(nutrition).forEach(key => {
    const value = nutrition[key as keyof Nutrition];
    if (typeof value === 'number' && (value < 0 || isNaN(value))) {
      nutrition[key as keyof Nutrition] = 0;
    }
  });
  
  // Fix for data_quality property - preserve the complex object structure
  // This is where the type error occurred - we need to ensure data_quality remains an object
  if (nutritionData.data_quality && typeof nutritionData.data_quality === 'object') {
    nutrition.data_quality = nutritionData.data_quality;
  }
  
  // Log the standardized result
  console.log("Standardized nutrition data:", nutrition);
  
  return nutrition;
}

/**
 * Standardizes micronutrient names and values
 */
function standardizeMicronutrients(nutrition: Nutrition): void {
  // Vitamin A
  if (nutrition.vitamin_a_iu !== undefined && !isNaN(Number(nutrition.vitamin_a_iu))) {
    nutrition.vitaminA = Number(nutrition.vitamin_a_iu);
  } else if (nutrition.vitaminA === undefined || isNaN(Number(nutrition.vitaminA))) {
    nutrition.vitaminA = 0;
  } else {
    nutrition.vitaminA = Number(nutrition.vitaminA);
  }
  
  // Vitamin C
  if (nutrition.vitamin_c_mg !== undefined && !isNaN(Number(nutrition.vitamin_c_mg))) {
    nutrition.vitaminC = Number(nutrition.vitamin_c_mg);
  } else if (nutrition.vitaminC === undefined || isNaN(Number(nutrition.vitaminC))) {
    nutrition.vitaminC = 0;
  } else {
    nutrition.vitaminC = Number(nutrition.vitaminC);
  }
  
  // Vitamin D
  if (nutrition.vitamin_d_iu !== undefined && !isNaN(Number(nutrition.vitamin_d_iu))) {
    nutrition.vitaminD = Number(nutrition.vitamin_d_iu);
  } else if (nutrition.vitaminD === undefined || isNaN(Number(nutrition.vitaminD))) {
    nutrition.vitaminD = 0;
  } else {
    nutrition.vitaminD = Number(nutrition.vitaminD);
  }
  
  // Calcium
  if (nutrition.calcium_mg !== undefined && !isNaN(Number(nutrition.calcium_mg))) {
    nutrition.calcium = Number(nutrition.calcium_mg);
  } else if (nutrition.calcium === undefined || isNaN(Number(nutrition.calcium))) {
    nutrition.calcium = 0;
  } else {
    nutrition.calcium = Number(nutrition.calcium);
  }
  
  // Iron
  if (nutrition.iron_mg !== undefined && !isNaN(Number(nutrition.iron_mg))) {
    nutrition.iron = Number(nutrition.iron_mg);
  } else if (nutrition.iron === undefined || isNaN(Number(nutrition.iron))) {
    nutrition.iron = 0;
  } else {
    nutrition.iron = Number(nutrition.iron);
  }
  
  // Potassium
  if (nutrition.potassium_mg !== undefined && !isNaN(Number(nutrition.potassium_mg))) {
    nutrition.potassium = Number(nutrition.potassium_mg);
  } else if (nutrition.potassium === undefined || isNaN(Number(nutrition.potassium))) {
    nutrition.potassium = 0;
  } else {
    nutrition.potassium = Number(nutrition.potassium);
  }
}

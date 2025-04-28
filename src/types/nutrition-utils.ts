
import { Nutrition } from '@/types/recipe';

// Standard nutrition field names to ensure consistency
export const NUTRITION_FIELD_NAMES = {
  calories: ['calories', 'kcal'],
  protein: ['protein_g', 'protein'],
  carbs: ['carbs_g', 'carbs'],
  fat: ['fat_g', 'fat'],
  fiber: ['fiber_g'],
  sugar: ['sugar_g'],
  sodium: ['sodium_mg']
};

export function standardizeNutrition(input: any): Nutrition {
  if (!input) return {};
  
  const output: Nutrition = {};
  
  // Map calories (priority to 'calories' field, fallback to 'kcal')
  if (input.calories !== undefined) {
    output.calories = Number(input.calories);
    output.kcal = Number(input.calories);
  } else if (input.kcal !== undefined) {
    output.calories = Number(input.kcal);
    output.kcal = Number(input.kcal);
  }
  
  // Map macronutrients with proper _g suffix
  if (input.protein !== undefined) {
    output.protein_g = Number(input.protein);
  } else if (input.protein_g !== undefined) {
    output.protein_g = Number(input.protein_g);
  }
  
  if (input.carbs !== undefined) {
    output.carbs_g = Number(input.carbs);
  } else if (input.carbs_g !== undefined) {
    output.carbs_g = Number(input.carbs_g);
  }
  
  if (input.fat !== undefined) {
    output.fat_g = Number(input.fat);
  } else if (input.fat_g !== undefined) {
    output.fat_g = Number(input.fat_g);
  }
  
  // Handle other nutrition fields with proper suffixes
  if (input.fiber_g !== undefined) output.fiber_g = Number(input.fiber_g);
  if (input.sugar_g !== undefined) output.sugar_g = Number(input.sugar_g);
  if (input.sodium_mg !== undefined) output.sodium_mg = Number(input.sodium_mg);
  
  return output;
}

export function validateNutrition(nutrition: any): boolean {
  if (!nutrition || typeof nutrition !== 'object') return false;
  
  // Check if at least one valid nutrition field exists
  const hasCalories = nutrition.calories !== undefined || nutrition.kcal !== undefined;
  const hasProtein = nutrition.protein_g !== undefined;
  const hasCarbs = nutrition.carbs_g !== undefined;
  const hasFat = nutrition.fat_g !== undefined;
  
  // Basic validation: must have at least calories and one macronutrient
  return hasCalories && (hasProtein || hasCarbs || hasFat);
}

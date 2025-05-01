
/**
 * Utility functions for working with nutrition data
 */

import { Nutrition } from "@/types/nutrition-utils";

/**
 * Deep merge function for nutrition data
 * This ensures all nutrition fields are preserved during updates
 */
export function deepMergeNutrition(
  existingNutrition: any = {},
  newNutrition: any = {}
): Nutrition {
  if (!existingNutrition) existingNutrition = {};
  if (!newNutrition) newNutrition = {};

  // Start with a base merged object
  const merged: Record<string, any> = { ...existingNutrition };

  // Define field mappings for different naming conventions
  const fieldMappings: Record<string, string[]> = {
    calories: ["kcal"],
    protein: ["protein_g"],
    fat: ["fat_g"],
    carbohydrates: ["carbs", "carbs_g"],
    fiber: ["fiber_g", "dietary_fiber"],
    sugar: ["sugar_g"],
    sodium: ["sodium_mg"],
    calcium: ["calcium_mg"],
    iron: ["iron_mg"],
    potassium: ["potassium_mg"],
    vitamin_a: ["vitaminA", "vitamin_a_iu"],
    vitamin_c: ["vitaminC", "vitamin_c_mg"],
    vitamin_d: ["vitaminD", "vitamin_d_iu"],
  };

  // Process new nutrition data and merge with existing data
  for (const [key, value] of Object.entries(newNutrition)) {
    if (value !== undefined && value !== null) {
      merged[key] = value;
      
      // Map to standard field if it's an alias
      for (const [standardField, aliases] of Object.entries(fieldMappings)) {
        if (aliases.includes(key)) {
          merged[standardField] = value;
          break;
        }
      }
      
      // Map from standard field to aliases
      if (fieldMappings[key]) {
        for (const alias of fieldMappings[key]) {
          merged[alias] = value;
        }
      }
    }
  }

  // Ensure all fields have valid number values
  for (const key of [
    ...Object.keys(fieldMappings),
    ...Object.values(fieldMappings).flat()
  ]) {
    if (typeof merged[key] === "string") {
      const num = parseFloat(merged[key]);
      if (!isNaN(num)) {
        merged[key] = num;
      }
    }
  }

  return merged as Nutrition;
}

/**
 * Validates if nutrition data is complete and consistent
 */
export function validateNutritionData(nutrition: any): boolean {
  if (!nutrition) return false;
  
  // Check for essential macronutrients
  const hasCalories = nutrition.calories !== undefined || nutrition.kcal !== undefined;
  const hasProtein = nutrition.protein !== undefined || nutrition.protein_g !== undefined;
  const hasFat = nutrition.fat !== undefined || nutrition.fat_g !== undefined;
  const hasCarbs = 
    nutrition.carbohydrates !== undefined || 
    nutrition.carbs !== undefined || 
    nutrition.carbs_g !== undefined;
    
  return hasCalories && (hasProtein || hasFat || hasCarbs);
}

/**
 * Logs differences between old and new nutrition data for debugging
 */
export function logNutritionChanges(oldData: any, newData: any): void {
  console.log("Nutrition update differences:");
  
  const allKeys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {})
  ]);
  
  for (const key of allKeys) {
    const oldValue = oldData?.[key];
    const newValue = newData?.[key];
    
    if (oldValue !== newValue) {
      console.log(`  ${key}: ${oldValue} → ${newValue}`);
    }
  }
}


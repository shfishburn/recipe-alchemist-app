
/**
 * Utility functions for working with nutrition data
 */

import { Nutrition, ExtendedNutritionData } from "@/types/nutrition-utils";

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

  // Enhanced field mappings for different naming conventions
  const fieldMappings: Record<string, string[]> = {
    calories: ["kcal", "energy", "energy_kcal"],
    protein: ["protein_g", "proteins", "proteins_g"],
    fat: ["fat_g", "fats", "total_fat", "total_fat_g"],
    carbohydrates: ["carbs", "carbs_g", "total_carbohydrate", "total_carbohydrate_g"],
    fiber: ["fiber_g", "dietary_fiber", "dietary_fiber_g", "fibre", "fibre_g"],
    sugar: ["sugar_g", "sugars", "sugars_g", "total_sugar", "total_sugar_g"],
    sodium: ["sodium_mg", "na", "na_mg"],
    calcium: ["calcium_mg", "ca", "ca_mg"],
    iron: ["iron_mg", "fe", "fe_mg"],
    potassium: ["potassium_mg", "k", "k_mg"],
    vitamin_a: ["vitaminA", "vitamin_a_iu", "vitamin_a_rae", "vit_a"],
    vitamin_c: ["vitaminC", "vitamin_c_mg", "vit_c"],
    vitamin_d: ["vitaminD", "vitamin_d_iu", "vitamin_d_mcg", "vit_d"],
  };

  // Process new nutrition data and merge with existing data
  for (const [key, value] of Object.entries(newNutrition)) {
    if (value !== undefined && value !== null) {
      // Convert string values to numbers for numeric fields
      if (typeof value === "string" && !isNaN(parseFloat(value))) {
        merged[key] = parseFloat(value);
      } else {
        merged[key] = value;
      }
      
      // Map to standard field if it's an alias
      for (const [standardField, aliases] of Object.entries(fieldMappings)) {
        if (aliases.includes(key)) {
          merged[standardField] = merged[key];
          break;
        }
      }
      
      // Map from standard field to aliases
      if (fieldMappings[key]) {
        for (const alias of fieldMappings[key]) {
          merged[alias] = merged[key];
        }
      }
    }
  }

  // Ensure all fields have valid number values
  const numericFields = [
    ...Object.keys(fieldMappings),
    ...Object.values(fieldMappings).flat()
  ];

  for (const key of numericFields) {
    if (merged[key] !== undefined) {
      if (typeof merged[key] === "string") {
        const num = parseFloat(merged[key]);
        if (!isNaN(num)) {
          merged[key] = num;
        }
      } else if (typeof merged[key] !== "number") {
        // Set to 0 if the value is not a number and can't be converted
        merged[key] = 0;
      }
      
      // Ensure non-negative values for nutrition fields
      if (typeof merged[key] === "number") {
        merged[key] = Math.max(0, merged[key]);
      }
    }
  }

  return merged as Nutrition;
}

/**
 * Validates if nutrition data is complete and consistent
 * @returns true if the nutrition data contains essential macronutrients
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
 * Performs detailed validation of nutrition data and returns any issues found
 * @returns Array of validation issue messages, empty if no issues
 */
export function validateNutritionDataQuality(nutrition: any): string[] {
  const issues: string[] = [];
  
  if (!nutrition) {
    issues.push("Missing nutrition data");
    return issues;
  }
  
  // Check for required fields
  if (nutrition.calories === undefined && nutrition.kcal === undefined) {
    issues.push("Missing calorie information");
  }
  
  if (nutrition.protein === undefined && nutrition.protein_g === undefined) {
    issues.push("Missing protein information");
  }
  
  if ((nutrition.carbohydrates === undefined && nutrition.carbs === undefined && nutrition.carbs_g === undefined)) {
    issues.push("Missing carbohydrate information");
  }
  
  if (nutrition.fat === undefined && nutrition.fat_g === undefined) {
    issues.push("Missing fat information");
  }
  
  // Check for reasonable ranges
  const calories = nutrition.calories || nutrition.kcal || 0;
  if (calories > 5000) {
    issues.push("Calorie value exceeds reasonable range");
  }
  
  const protein = nutrition.protein || nutrition.protein_g || 0;
  if (protein > 500) {
    issues.push("Protein value exceeds reasonable range");
  }
  
  // Verify macronutrient consistency using Atwater factors
  const carbs = nutrition.carbohydrates || nutrition.carbs || nutrition.carbs_g || 0;
  const fat = nutrition.fat || nutrition.fat_g || 0;
  
  if (calories > 0 && (protein > 0 || carbs > 0 || fat > 0)) {
    // Approximate calories based on macronutrients using Atwater factors
    const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);
    
    // If the difference is more than 20%, flag it as an issue
    if (Math.abs(calculatedCalories - calories) / calories > 0.2) {
      issues.push("Calorie value inconsistent with macronutrient values");
    }
  }
  
  return issues;
}

/**
 * Formats a nutrition value for display
 * Rounds to integers for cleaner UI display
 */
export function formatNutritionValue(value: number | undefined | null): string {
  if (value === undefined || value === null) return "0";
  return Math.round(value).toString();
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

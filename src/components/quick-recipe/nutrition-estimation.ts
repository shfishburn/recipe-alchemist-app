
import { Ingredient } from '@/hooks/use-quick-recipe';
import { Nutrition } from '@/types/recipe';
import { convertToGrams } from '@/utils/unit-conversion';

// Basic nutrition estimates per common ingredient type (per 100g)
const NUTRITION_ESTIMATES: Record<string, Partial<Nutrition>> = {
  // Proteins
  'chicken': { calories: 165, protein_g: 31, fat_g: 3.6, carbs_g: 0 },
  'beef': { calories: 250, protein_g: 26, fat_g: 17, carbs_g: 0 },
  'fish': { calories: 150, protein_g: 20, fat_g: 6, carbs_g: 0 },
  'pork': { calories: 242, protein_g: 27, fat_g: 14, carbs_g: 0 },
  'tofu': { calories: 76, protein_g: 8, fat_g: 4.8, carbs_g: 1.9 },
  
  // Carbs
  'pasta': { calories: 131, protein_g: 5, fat_g: 1.1, carbs_g: 25 },
  'rice': { calories: 130, protein_g: 2.7, fat_g: 0.3, carbs_g: 28 },
  'potato': { calories: 77, protein_g: 2, fat_g: 0.1, carbs_g: 17 },
  'bread': { calories: 265, protein_g: 9, fat_g: 3.2, carbs_g: 49 },
  
  // Vegetables
  'carrot': { calories: 41, protein_g: 0.9, fat_g: 0.2, carbs_g: 9.6 },
  'broccoli': { calories: 34, protein_g: 2.8, fat_g: 0.4, carbs_g: 6.6 },
  'spinach': { calories: 23, protein_g: 2.9, fat_g: 0.4, carbs_g: 3.6 },
  'onion': { calories: 40, protein_g: 1.1, fat_g: 0.1, carbs_g: 9.3 },
  'garlic': { calories: 149, protein_g: 6.4, fat_g: 0.5, carbs_g: 33 },
  
  // Fats
  'olive oil': { calories: 884, protein_g: 0, fat_g: 100, carbs_g: 0 },
  'butter': { calories: 717, protein_g: 0.9, fat_g: 81, carbs_g: 0.1 },
  
  // Dairy
  'cheese': { calories: 350, protein_g: 22, fat_g: 28, carbs_g: 2 },
  'milk': { calories: 42, protein_g: 3.4, fat_g: 1, carbs_g: 5 },
  'cream': { calories: 340, protein_g: 2.1, fat_g: 37, carbs_g: 2.8 },
  
  // Default for unknown ingredients
  'default': { calories: 50, protein_g: 2, fat_g: 2, carbs_g: 5 }
};

// Function to estimate nutrition for a recipe
export function estimateNutrition(ingredients: Ingredient[], servings: number): Nutrition {
  // Initialize nutrition object
  const totalNutrition: Nutrition = {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
    sugar_g: 0
  };
  
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    console.warn("No ingredients provided for nutrition estimation");
    // Return minimal base values instead of inflated ones
    totalNutrition.calories = 100;
    totalNutrition.protein_g = 5;
    totalNutrition.carbs_g = 10;
    totalNutrition.fat_g = 5;
    return totalNutrition;
  }
  
  // Process each ingredient
  ingredients.forEach(ingredient => {
    if (typeof ingredient === 'string') {
      // For string ingredients, use reduced default estimates
      totalNutrition.calories! += NUTRITION_ESTIMATES.default.calories! * 0.5;
      totalNutrition.protein_g! += NUTRITION_ESTIMATES.default.protein_g! * 0.5;
      totalNutrition.carbs_g! += NUTRITION_ESTIMATES.default.carbs_g! * 0.5;
      totalNutrition.fat_g! += NUTRITION_ESTIMATES.default.fat_g! * 0.5;
      return;
    }
    
    const { qty = 1, unit = 'g', item } = ingredient;
    
    // Find matching ingredient type
    let ingredientType = 'default';
    const itemName = typeof item === 'string' ? item.toLowerCase() : 
                     typeof item === 'object' && item && typeof item.item === 'string' ? 
                     item.item.toLowerCase() : 'default';
    
    for (const key of Object.keys(NUTRITION_ESTIMATES)) {
      if (itemName.includes(key)) {
        ingredientType = key;
        break;
      }
    }
    
    // Calculate quantity in grams - use our more accurate unit conversion utility
    let quantityInGrams;
    
    try {
      // Try to use the more accurate conversion utility
      quantityInGrams = convertToGrams(qty, unit || 'g', itemName);
    } catch (error) {
      // Fallback to simple estimation
      const standardUnit = unit.toLowerCase();
      const simpleConversions: Record<string, number> = {
        'g': 1,
        'kg': 1000,
        'oz': 28.35,
        'lb': 453.6,
        'cup': 240,
        'tbsp': 15,
        'tsp': 5,
        'ml': 1,
        'l': 1000,
        'piece': 30,
        'slice': 20,
        'clove': 3
      };
      
      const conversionFactor = simpleConversions[standardUnit] || 1;
      quantityInGrams = qty * conversionFactor;
    }
    
    // Apply scaling factor for more reasonable values
    const scalingFactor = 0.6; // Reduce inflated values
    
    // Calculate nutrition based on quantity
    const nutritionScale = (quantityInGrams / 100) * scalingFactor; // per 100g, with scaling
    const ingredientNutrition = NUTRITION_ESTIMATES[ingredientType];
    
    totalNutrition.calories! += (ingredientNutrition.calories || 0) * nutritionScale;
    totalNutrition.protein_g! += (ingredientNutrition.protein_g || 0) * nutritionScale;
    totalNutrition.carbs_g! += (ingredientNutrition.carbs_g || 0) * nutritionScale;
    totalNutrition.fat_g! += (ingredientNutrition.fat_g || 0) * nutritionScale;
  });
  
  // Calculate per serving
  if (servings > 0) {
    totalNutrition.calories = Math.round(totalNutrition.calories! / servings);
    totalNutrition.protein_g = Math.round(totalNutrition.protein_g! / servings);
    totalNutrition.carbs_g = Math.round(totalNutrition.carbs_g! / servings);
    totalNutrition.fat_g = Math.round(totalNutrition.fat_g! / servings);
    totalNutrition.fiber_g = Math.round((totalNutrition.fiber_g || 0) / servings);
    totalNutrition.sugar_g = Math.round((totalNutrition.sugar_g || 0) / servings);
  }
  
  // Cap maximum values to avoid ridiculous estimates
  const maxCalories = 800; // per serving
  if (totalNutrition.calories! > maxCalories) {
    // Scale all values proportionally if calories are too high
    const scaleFactor = maxCalories / totalNutrition.calories!;
    totalNutrition.calories = maxCalories;
    totalNutrition.protein_g = Math.round(totalNutrition.protein_g! * scaleFactor);
    totalNutrition.carbs_g = Math.round(totalNutrition.carbs_g! * scaleFactor);
    totalNutrition.fat_g = Math.round(totalNutrition.fat_g! * scaleFactor);
  }
  
  // Also include kcal as an alias for calories
  totalNutrition.kcal = totalNutrition.calories;
  
  // Add reasonable placeholder values for other nutrients
  totalNutrition.sodium_mg = Math.round(totalNutrition.calories * 0.8);
  totalNutrition.vitamin_a_iu = 50;
  totalNutrition.vitamin_c_mg = 5;
  totalNutrition.vitamin_d_iu = 20;
  totalNutrition.calcium_mg = 50;
  totalNutrition.iron_mg = 1;
  totalNutrition.potassium_mg = 150;
  
  return totalNutrition;
}

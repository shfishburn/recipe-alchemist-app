
import { Ingredient } from '@/hooks/use-quick-recipe';
import { Nutrition } from '@/types/recipe';

// Basic nutrition estimates per common ingredient type (per 100g)
const NUTRITION_ESTIMATES: Record<string, Partial<Nutrition>> = {
  // Proteins
  'chicken': { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
  'beef': { calories: 250, protein: 26, fat: 17, carbs: 0 },
  'fish': { calories: 150, protein: 20, fat: 6, carbs: 0 },
  'pork': { calories: 242, protein: 27, fat: 14, carbs: 0 },
  'tofu': { calories: 76, protein: 8, fat: 4.8, carbs: 1.9 },
  
  // Carbs
  'pasta': { calories: 131, protein: 5, fat: 1.1, carbs: 25 },
  'rice': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
  'potato': { calories: 77, protein: 2, fat: 0.1, carbs: 17 },
  'bread': { calories: 265, protein: 9, fat: 3.2, carbs: 49 },
  
  // Vegetables
  'carrot': { calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6 },
  'broccoli': { calories: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
  'spinach': { calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
  'onion': { calories: 40, protein: 1.1, fat: 0.1, carbs: 9.3 },
  'garlic': { calories: 149, protein: 6.4, fat: 0.5, carbs: 33 },
  
  // Fats
  'olive oil': { calories: 884, protein: 0, fat: 100, carbs: 0 },
  'butter': { calories: 717, protein: 0.9, fat: 81, carbs: 0.1 },
  
  // Dairy
  'cheese': { calories: 350, protein: 22, fat: 28, carbs: 2 },
  'milk': { calories: 42, protein: 3.4, fat: 1, carbs: 5 },
  'cream': { calories: 340, protein: 2.1, fat: 37, carbs: 2.8 },
  
  // Default for unknown ingredients
  'default': { calories: 50, protein: 2, fat: 2, carbs: 5 }
};

// Helper function to estimate grams from unit and quantity
function estimateGramsFromUnit(qty: number, unit: string, item: string): number {
  const standardUnit = unit.toLowerCase();
  
  // Basic conversion table for common units to grams
  const simpleConversions: Record<string, number> = {
    'g': 1,
    'kg': 1000,
    'oz': 28.35,
    'lb': 453.6,
    'cup': 240,
    'cups': 240,
    'tbsp': 15,
    'tsp': 5,
    'ml': 1,
    'l': 1000,
    'piece': 30,
    'slice': 20,
    'clove': 3
  };

  // Item-specific conversions
  const itemSpecificConversions: Record<string, Record<string, number>> = {
    'onion': { 'medium': 110, 'large': 150, 'small': 70 },
    'potato': { 'medium': 150, 'large': 300, 'small': 100 },
    'carrot': { 'medium': 60, 'large': 80, 'small': 40 },
    'egg': { 'medium': 50, 'large': 60, 'small': 40 },
    'apple': { 'medium': 180, 'large': 220, 'small': 150 },
    'garlic': { 'clove': 3, 'head': 50 }
  };
  
  // Check for item-specific conversions
  for (const itemName in itemSpecificConversions) {
    if (item.toLowerCase().includes(itemName)) {
      const sizeConversions = itemSpecificConversions[itemName];
      for (const size in sizeConversions) {
        if (unit.toLowerCase().includes(size)) {
          return qty * sizeConversions[size];
        }
      }
    }
  }
  
  // Fall back to simple conversions
  const conversionFactor = simpleConversions[standardUnit] || 1;
  return qty * conversionFactor;
}

// Function to estimate nutrition for a recipe
export function estimateNutrition(ingredients: Ingredient[], servings: number): Nutrition {
  // Initialize nutrition object with required fields
  const totalNutrition: Nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };
  
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    console.warn("No ingredients provided for nutrition estimation");
    // Return minimal base values instead of inflated ones
    totalNutrition.calories = 100;
    totalNutrition.protein = 5;
    totalNutrition.carbs = 10;
    totalNutrition.fat = 5;
    return totalNutrition;
  }
  
  // Process each ingredient
  ingredients.forEach(ingredient => {
    if (!ingredient || typeof ingredient === 'string') {
      // For string ingredients, use reduced default estimates
      totalNutrition.calories += NUTRITION_ESTIMATES.default.calories! * 0.5;
      totalNutrition.protein += NUTRITION_ESTIMATES.default.protein! * 0.5;
      totalNutrition.carbs += NUTRITION_ESTIMATES.default.carbs! * 0.5;
      totalNutrition.fat += NUTRITION_ESTIMATES.default.fat! * 0.5;
      return;
    }
    
    const { qty = 1, unit = 'g' } = ingredient;
    
    // Safely extract item name
    const itemName = ingredient.item ? 
      (typeof ingredient.item === 'string' ? ingredient.item.toLowerCase() : 
       typeof ingredient.item === 'object' && ingredient.item ? 
       (typeof ingredient.item.item === 'string' ? ingredient.item.item.toLowerCase() : 'default') :
       'default') :
      'default';
    
    // Find matching ingredient type
    let ingredientType = 'default';
    for (const key of Object.keys(NUTRITION_ESTIMATES)) {
      if (itemName.includes(key)) {
        ingredientType = key;
        break;
      }
    }
    
    // Calculate quantity in grams - use our custom estimation function
    let quantityInGrams = estimateGramsFromUnit(qty, unit || 'g', itemName);
    
    // Apply scaling factor for more reasonable values
    const scalingFactor = 0.6; // Reduce inflated values
    
    // Calculate nutrition based on quantity
    const nutritionScale = (quantityInGrams / 100) * scalingFactor; // per 100g, with scaling
    const ingredientNutrition = NUTRITION_ESTIMATES[ingredientType];
    
    totalNutrition.calories += (ingredientNutrition.calories || 0) * nutritionScale;
    totalNutrition.protein += (ingredientNutrition.protein || 0) * nutritionScale;
    totalNutrition.carbs += (ingredientNutrition.carbs || 0) * nutritionScale;
    totalNutrition.fat += (ingredientNutrition.fat || 0) * nutritionScale;
  });
  
  // Calculate per serving
  if (servings > 0) {
    totalNutrition.calories = Math.round(totalNutrition.calories / servings);
    totalNutrition.protein = Math.round(totalNutrition.protein / servings);
    totalNutrition.carbs = Math.round(totalNutrition.carbs / servings);
    totalNutrition.fat = Math.round(totalNutrition.fat / servings);
    totalNutrition.fiber = Math.round((totalNutrition.fiber || 0) / servings);
    totalNutrition.sugar = Math.round((totalNutrition.sugar || 0) / servings);
  }
  
  // Cap maximum values to avoid ridiculous estimates
  const maxCalories = 800; // per serving
  if (totalNutrition.calories > maxCalories) {
    // Scale all values proportionally if calories are too high
    const scaleFactor = maxCalories / totalNutrition.calories;
    totalNutrition.calories = maxCalories;
    totalNutrition.protein = Math.round(totalNutrition.protein * scaleFactor);
    totalNutrition.carbs = Math.round(totalNutrition.carbs * scaleFactor);
    totalNutrition.fat = Math.round(totalNutrition.fat * scaleFactor);
  }
  
  // Also include kcal as an alias for calories
  totalNutrition.kcal = totalNutrition.calories;
  
  // Add reasonable placeholder values for other nutrients
  totalNutrition.sodium_mg = Math.round(totalNutrition.calories * 0.8);
  totalNutrition.vitamin_a = 50;
  totalNutrition.vitamin_c = 5;
  totalNutrition.vitamin_d = 20;
  totalNutrition.calcium = 50;
  totalNutrition.iron = 1;
  totalNutrition.potassium = 150;
  
  // Also add compatibility aliases
  totalNutrition.protein_g = totalNutrition.protein;
  totalNutrition.carbs_g = totalNutrition.carbs;
  totalNutrition.fat_g = totalNutrition.fat;
  totalNutrition.fiber_g = totalNutrition.fiber;
  totalNutrition.sugar_g = totalNutrition.sugar;
  
  return totalNutrition;
}

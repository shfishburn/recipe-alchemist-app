
import type { Recipe } from '@/types/recipe';
import type { CuisineCategory } from '@/types/database';

/**
 * Validates and ensures a recipe has all required fields and correct data types
 * @param recipe The recipe to validate and fix
 * @returns The recipe with all required fields and correct types
 */
export function ensureRecipeIntegrity(recipe: Partial<Recipe>): Recipe {
  if (!recipe) {
    throw new Error('Recipe is undefined or null');
  }
  
  // Ensure basic required fields
  if (!recipe.title) {
    throw new Error('Recipe must have a title');
  }
  
  // Ensure ingredients array exists
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
    throw new Error('Recipe must have ingredients as an array');
  }
  
  // Ensure instructions array exists
  if (!recipe.instructions || !Array.isArray(recipe.instructions)) {
    throw new Error('Recipe must have instructions as an array');
  }
  
  // Ensure servings is a number
  if (typeof recipe.servings !== 'number' || isNaN(recipe.servings)) {
    recipe.servings = 1; // Default to 1 serving if invalid
    console.warn('Invalid servings value, defaulting to 1');
  }
  
  // Validate cuisine_category if present
  if (recipe.cuisine_category) {
    const validCategories: CuisineCategory[] = [
      "Global", "Regional American", "European", 
      "Asian", "Dietary Styles", "Middle Eastern"
    ];
    
    if (!validCategories.includes(recipe.cuisine_category as CuisineCategory)) {
      recipe.cuisine_category = "Global";
      console.warn(`Invalid cuisine_category "${recipe.cuisine_category}", defaulted to "Global"`);
    }
  }
  
  // Ensure nutrition object exists (even if empty)
  if (!recipe.nutrition) {
    recipe.nutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };
  }
  
  return recipe as Recipe;
}

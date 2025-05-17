
// This file is deprecated and serves as a re-export for backward compatibility
// Import from '@/types/quick-recipe' instead

import { QuickRecipe, Ingredient, RecipeNutrition, NutriScore, VersionInfo } from './quick-recipe';

export type Recipe = QuickRecipe;
export type { Ingredient, RecipeNutrition as Nutrition, NutriScore, VersionInfo };

// Helper function to convert any partial recipe data to a valid Recipe object
// This helps with backward compatibility where code expects certain fields
export function ensureValidRecipe(recipeData: Partial<Recipe>): Recipe {
  return {
    title: recipeData.title || "Untitled Recipe",
    ingredients: recipeData.ingredients || [],
    servings: recipeData.servings || 2,
    instructions: recipeData.instructions || recipeData.steps || [],
    id: recipeData.id || "",
    ...recipeData
  };
}

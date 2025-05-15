
import type { Recipe } from '@/types/recipe';

/**
 * Helper functions to transform recipe data for different contexts
 */

/**
 * Gets the description for a recipe, handling both tagline and description fields
 */
export function getRecipeDescription(recipe: Recipe): string {
  return recipe.tagline || '';
}

/**
 * Transforms database response to Recipe type
 */
export function transformRecipeData(data: any): Recipe {
  // Handle possible JSON fields
  const ingredients = typeof data.ingredients === 'string' 
    ? JSON.parse(data.ingredients) 
    : data.ingredients;

  const instructions = typeof data.instructions === 'string'
    ? JSON.parse(data.instructions)
    : data.instructions;

  const science_notes = typeof data.science_notes === 'string'
    ? JSON.parse(data.science_notes)
    : data.science_notes || [];

  const nutrition = typeof data.nutrition === 'string'
    ? JSON.parse(data.nutrition)
    : data.nutrition;

  const nutri_score = typeof data.nutri_score === 'string'
    ? JSON.parse(data.nutri_score)
    : data.nutri_score;

  // Map the database fields to the Recipe type
  return {
    id: data.id,
    title: data.title,
    tagline: data.tagline,
    ingredients: ingredients,
    instructions: instructions,
    science_notes: science_notes || [],
    image_url: data.image_url,
    servings: data.servings,
    prep_time_min: data.prep_time_min,
    cook_time_min: data.cook_time_min,
    cuisine: data.cuisine,
    cuisine_category: data.cuisine_category,
    nutrition: nutrition,
    nutri_score: nutri_score,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    version_number: data.version_number,
    previous_version_id: data.previous_version_id,
    deleted_at: data.deleted_at,
    flavor_tags: data.flavor_tags,
    dietary: data.dietary,
    chef_notes: data.chef_notes,
    cooking_tip: data.cooking_tip,
    slug: data.slug
  };
}

/**
 * Ensures a recipe has all required fields with safe defaults
 */
export function ensureCompleteRecipe(recipe: Partial<Recipe>): Recipe {
  return {
    id: recipe.id || '',
    title: recipe.title || 'Untitled Recipe',
    tagline: recipe.tagline || '',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    science_notes: recipe.science_notes || [],
    ...recipe
  };
}

/**
 * Check if a recipe has essential data
 */
export function isRecipeComplete(recipe?: Partial<Recipe>): boolean {
  if (!recipe) return false;
  
  return !!(
    recipe.id &&
    recipe.title &&
    recipe.ingredients?.length > 0 &&
    recipe.instructions?.length > 0
  );
}


import { Recipe, Ingredient, Nutrition } from '@/types/recipe';
import { standardizeNutrition } from './recipe-utils';

/**
 * Transform raw database recipe data into a structured Recipe object
 */
export function transformRecipeData(data: any): Recipe {
  // Create default minimal recipe
  const recipe: Recipe = {
    id: data.id || '',
    title: data.title || 'Unnamed Recipe',
    tagline: data.tagline || '',
    ingredients: [],
    instructions: [],
    science_notes: []
  };
  
  // Parse and add other fields if available
  if (data) {
    // Add basic fields
    if (data.image_url) recipe.image_url = data.image_url;
    if (data.cuisine) recipe.cuisine = data.cuisine;
    if (data.prep_time_min) recipe.prep_time_min = data.prep_time_min;
    if (data.cook_time_min) recipe.cook_time_min = data.cook_time_min;
    if (data.servings) recipe.servings = data.servings;
    if (data.dietary) recipe.dietary = data.dietary;
    if (data.user_id) recipe.user_id = data.user_id;
    if (data.cuisine_category) recipe.cuisine_category = data.cuisine_category;
    if (data.slug) recipe.slug = data.slug;
    
    // Parse ingredients if available
    if (data.ingredients) {
      try {
        recipe.ingredients = Array.isArray(data.ingredients) 
          ? data.ingredients 
          : typeof data.ingredients === 'object'
            ? Object.values(data.ingredients)
            : typeof data.ingredients === 'string'
              ? JSON.parse(data.ingredients)
              : [];
      } catch (e) {
        console.error('Error parsing ingredients:', e);
      }
    }
    
    // Parse instructions if available
    if (data.instructions) {
      try {
        recipe.instructions = Array.isArray(data.instructions)
          ? data.instructions
          : typeof data.instructions === 'string'
            ? JSON.parse(data.instructions)
            : [];
      } catch (e) {
        console.error('Error parsing instructions:', e);
      }
    }
    
    // Parse science_notes if available
    if (data.science_notes) {
      try {
        recipe.science_notes = Array.isArray(data.science_notes)
          ? data.science_notes
          : typeof data.science_notes === 'string'
            ? JSON.parse(data.science_notes)
            : [];
      } catch (e) {
        console.error('Error parsing science_notes:', e);
      }
    }
    
    // Parse nutrition if available
    if (data.nutrition) {
      try {
        recipe.nutrition = standardizeNutrition(data.nutrition);
      } catch (e) {
        console.error('Error parsing nutrition:', e);
      }
    }
    
    // Parse nutri_score if available
    if (data.nutri_score) {
      try {
        recipe.nutri_score = typeof data.nutri_score === 'string'
          ? JSON.parse(data.nutri_score)
          : data.nutri_score;
      } catch (e) {
        console.error('Error parsing nutri_score:', e);
      }
    }
  }
  
  return recipe;
}

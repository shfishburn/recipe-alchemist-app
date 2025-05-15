
import type { Recipe } from '@/types/recipe';

/**
 * Transform a recipe from the database format to the application format
 */
export function transformRecipeData(dbRecipe: any): Recipe {
  // Safety check to avoid errors with null data
  if (!dbRecipe) {
    console.error('Attempted to transform null or undefined recipe data');
    throw new Error('Invalid recipe data provided for transformation');
  }
  
  // Parse ingredients JSON to Ingredient array
  let ingredients = [];
  try {
    ingredients = Array.isArray(dbRecipe.ingredients) 
      ? dbRecipe.ingredients
      : typeof dbRecipe.ingredients === 'object' 
        ? Object.values(dbRecipe.ingredients)
        : [];
  } catch (e) {
    console.error('Failed to parse ingredients', e);
  }
  
  // Parse science_notes JSON to string array
  let scienceNotes = [];
  try {
    if (dbRecipe.science_notes) {
      scienceNotes = Array.isArray(dbRecipe.science_notes) 
        ? dbRecipe.science_notes.map((note: any) => typeof note === 'string' ? note : String(note))
        : [];
    }
  } catch (e) {
    console.error('Failed to parse science notes', e);
  }
  
  // Parse instructions to ensure they're an array of strings
  let instructions = [];
  try {
    if (dbRecipe.instructions) {
      instructions = Array.isArray(dbRecipe.instructions)
        ? dbRecipe.instructions.map((instruction: any) => 
            typeof instruction === 'string' ? instruction : String(instruction))
        : [];
    }
  } catch (e) {
    console.error('Failed to parse instructions', e);
  }
  
  // Handle nutrition data with defaults
  let nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };
  
  try {
    if (dbRecipe.nutrition && typeof dbRecipe.nutrition === 'object') {
      nutrition = {
        ...nutrition,
        ...dbRecipe.nutrition
      };
    }
  } catch (e) {
    console.error('Failed to parse nutrition', e);
  }
  
  // Extract tagline from either tagline or description field
  const tagline = dbRecipe.tagline || dbRecipe.description || '';
  
  // Return a complete Recipe object with default values for missing properties
  return {
    id: dbRecipe.id,
    title: dbRecipe.title || '',
    tagline: tagline,
    ingredients: ingredients,
    instructions: instructions,
    prep_time_min: dbRecipe.prep_time_min,
    cook_time_min: dbRecipe.cook_time_min,
    servings: dbRecipe.servings || 1,
    image_url: dbRecipe.image_url,
    cuisine: dbRecipe.cuisine,
    cuisine_category: dbRecipe.cuisine_category || "Global",
    tags: dbRecipe.tags || [],
    user_id: dbRecipe.user_id,
    created_at: dbRecipe.created_at || new Date().toISOString(),
    updated_at: dbRecipe.updated_at || new Date().toISOString(),
    original_request: dbRecipe.original_request || '',
    reasoning: dbRecipe.reasoning || '',
    version_number: dbRecipe.version_number || 1,
    previous_version_id: dbRecipe.previous_version_id,
    deleted_at: dbRecipe.deleted_at,
    dietary: dbRecipe.dietary || '',
    flavor_tags: dbRecipe.flavor_tags || [],
    nutrition: nutrition,
    science_notes: scienceNotes,
    chef_notes: dbRecipe.chef_notes || '',
    nutri_score: dbRecipe.nutri_score || null,
    slug: dbRecipe.slug || ''
  };
}

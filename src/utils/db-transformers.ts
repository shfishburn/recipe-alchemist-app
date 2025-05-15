
import type { Json } from '@/integrations/supabase/types';
import type { Recipe, Ingredient, Nutrition, NutriScore } from '@/types/recipe';
import type { Ingredient as QuickRecipeIngredient } from '@/types/quick-recipe';
import { standardizeNutrition } from './nutrition-utils';

/**
 * List of valid database column names for the recipes table
 * Used for filtering objects before database operations
 */
export const VALID_DB_FIELDS = [
  'id',
  'title',
  'tagline', // Database uses tagline, not description
  'ingredients',
  'instructions',
  'servings',
  'prep_time_min',
  'cook_time_min',
  'image_url',
  'cuisine',
  'cuisine_category',
  'tags',
  'user_id',
  'created_at',
  'updated_at',
  'version_number',
  'previous_version_id',
  'deleted_at',
  'dietary',
  'flavor_tags',
  'nutrition',
  'science_notes',
  'chef_notes',
  'cooking_tip',
  'slug',
  'nutri_score'
];

/**
 * Safely converts any value to JSON format
 * @param value - The value to convert to JSON
 * @param fallback - Optional fallback value if conversion fails
 * @returns The value as a Json type
 */
export function safelyConvertToJson(value: unknown, fallback: Json = '[]' as Json): Json {
  if (value === null || value === undefined) {
    return fallback;
  }
  
  try {
    return JSON.stringify(value) as Json;
  } catch (error) {
    console.error("Failed to serialize value to JSON:", error);
    console.warn("Value that failed serialization:", typeof value);
    return fallback;
  }
}

/**
 * Safely parses a JSON string to an array
 * @param jsonValue - The JSON string or value to parse
 * @param fallback - The fallback array if parsing fails
 * @returns The parsed array or fallback
 */
export function safelyParseJsonArray<T>(jsonValue: any, fallback: T[] = []): T[] {
  if (!jsonValue) return fallback;
  
  // If it's already an array, just return it
  if (Array.isArray(jsonValue)) return jsonValue;
  
  // If it's a string, try to parse it
  if (typeof jsonValue === 'string') {
    try {
      const parsed = JSON.parse(jsonValue);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return fallback;
    }
  }
  
  // For any other type, return the fallback
  return fallback;
}

/**
 * Transforms a QuickRecipeIngredient to a database-compatible Ingredient
 * @param ingredient - Source ingredient from QuickRecipe
 * @returns Database-compatible Ingredient
 */
export function transformIngredient(ingredient: QuickRecipeIngredient | Ingredient): Ingredient {
  // Start with default values for required fields
  const result: Ingredient = {
    qty_metric: 0,
    unit_metric: '',
    qty_imperial: 0,
    unit_imperial: '',
    item: typeof ingredient.item === 'string' ? ingredient.item : 'Ingredient',
  };
  
  // Copy over existing values, prioritizing metric/imperial fields
  if ('qty_metric' in ingredient) result.qty_metric = ingredient.qty_metric || 0;
  if ('unit_metric' in ingredient) result.unit_metric = ingredient.unit_metric || '';
  if ('qty_imperial' in ingredient) result.qty_imperial = ingredient.qty_imperial || 0;
  if ('unit_imperial' in ingredient) result.unit_imperial = ingredient.unit_imperial || '';
  
  // Fall back to legacy fields if metric/imperial not available
  if (!result.qty_metric && ingredient.qty) result.qty_metric = ingredient.qty;
  if (!result.unit_metric && ingredient.unit) result.unit_metric = ingredient.unit;
  
  // Preserve other fields
  if (ingredient.notes) result.notes = ingredient.notes;
  if (ingredient.shop_size_qty) result.shop_size_qty = ingredient.shop_size_qty;
  if (ingredient.shop_size_unit) result.shop_size_unit = ingredient.shop_size_unit;
  
  // Legacy support
  if (ingredient.qty) result.qty = ingredient.qty;
  if (ingredient.unit) result.unit = ingredient.unit;
  
  return result;
}

/**
 * Transforms a recipe object for database storage
 * @param recipe - The recipe object to transform
 * @returns A database-compatible object
 */
export function transformRecipeForDb(recipe: Partial<Recipe> | any): Record<string, any> {
  // Deep clone to avoid modifying the original
  const recipeClone = JSON.parse(JSON.stringify(recipe));
  const result: Record<string, any> = {};
  
  // Handle description/tagline mapping - database uses tagline
  if (recipeClone.description !== undefined) {
    result.tagline = recipeClone.description;
  }
  
  // Special handling for arrays that need to be stored as JSON
  if (recipeClone.ingredients) {
    // Transform ingredients to ensure they have required fields
    const transformedIngredients = recipeClone.ingredients.map(i => transformIngredient(i));
    result.ingredients = transformedIngredients;
  }
  
  if (recipeClone.instructions) {
    result.instructions = recipeClone.instructions;
  }
  
  if (recipeClone.science_notes) {
    // Ensure science_notes is an array of strings
    const validatedNotes = Array.isArray(recipeClone.science_notes) 
      ? recipeClone.science_notes.map(note => (note !== null && note !== undefined) ? String(note) : '')
      : (recipeClone.science_notes ? [String(recipeClone.science_notes)] : []);
    
    result.science_notes = validatedNotes;
  } else {
    result.science_notes = [];
  }
  
  if (recipeClone.flavor_tags) {
    result.flavor_tags = Array.isArray(recipeClone.flavor_tags) 
      ? recipeClone.flavor_tags 
      : (typeof recipeClone.flavor_tags === 'string' ? [recipeClone.flavor_tags] : []);
  }
  
  if (recipeClone.nutrition) {
    // Standardize nutrition data
    const standardizedNutrition = standardizeNutrition(recipeClone.nutrition);
    result.nutrition = standardizedNutrition;
  }
  
  if (recipeClone.nutri_score) {
    result.nutri_score = recipeClone.nutri_score;
  }
  
  // Copy all other valid fields
  for (const key in recipeClone) {
    if (VALID_DB_FIELDS.includes(key) && result[key] === undefined) {
      result[key] = recipeClone[key];
    }
  }
  
  // Ensure essential fields are present
  if (result.servings === undefined) {
    result.servings = recipeClone.servings || 1; // Default to 1
  }
  
  // Filter out any properties not in our valid fields list
  const finalResult: Record<string, any> = {};
  for (const field of VALID_DB_FIELDS) {
    if (result[field] !== undefined) {
      finalResult[field] = result[field];
    }
  }
  
  // Always preserve user_id if present
  if ('user_id' in recipeClone) {
    finalResult.user_id = recipeClone.user_id;
  }
  
  return finalResult;
}

/**
 * Transforms a database recipe into an application recipe
 * @param dbRecipe - The database recipe object
 * @returns A properly formatted Recipe object
 */
export function transformDbToRecipe(dbRecipe: Record<string, any>): Recipe {
  // Deep clone to avoid modifying the original
  const dbRecipeClone = JSON.parse(JSON.stringify(dbRecipe));
  const result: Partial<Recipe> = {};
  
  // Handle tagline/description mapping - app uses description
  if (dbRecipeClone.tagline !== undefined) {
    result.tagline = dbRecipeClone.tagline;
  }
  
  // Handle arrays that are stored as JSON
  if (dbRecipeClone.ingredients) {
    // Parse ingredients from JSON if needed
    const parsedIngredients = safelyParseJsonArray<Partial<Ingredient>>(dbRecipeClone.ingredients, []);
    // Ensure all ingredients have required fields
    result.ingredients = parsedIngredients.map(i => transformIngredient(i as QuickRecipeIngredient));
  } else {
    result.ingredients = [];
  }
  
  if (dbRecipeClone.instructions) {
    // Parse instructions from JSON if needed
    result.instructions = safelyParseJsonArray<string>(dbRecipeClone.instructions, []);
  } else {
    result.instructions = [];
  }
  
  if (dbRecipeClone.science_notes) {
    // Parse science_notes from JSON if needed
    result.science_notes = safelyParseJsonArray<string>(dbRecipeClone.science_notes, []);
  } else {
    result.science_notes = [];
  }
  
  if (dbRecipeClone.nutrition) {
    const nutrition = typeof dbRecipeClone.nutrition === 'string' 
      ? JSON.parse(dbRecipeClone.nutrition) 
      : dbRecipeClone.nutrition;
    
    result.nutrition = standardizeNutrition(nutrition) as Nutrition;
  } else {
    // Default nutrition object
    result.nutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };
  }
  
  if (dbRecipeClone.nutri_score) {
    result.nutri_score = typeof dbRecipeClone.nutri_score === 'string'
      ? JSON.parse(dbRecipeClone.nutri_score)
      : dbRecipeClone.nutri_score;
  }
  
  // Copy all other fields
  for (const key in dbRecipeClone) {
    if (result[key] === undefined) {
      result[key] = dbRecipeClone[key];
    }
  }
  
  return result as Recipe;
}

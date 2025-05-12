
import { FIELD_MAPPINGS, VALID_DB_FIELDS } from './recipe-save-constants';

/**
 * Transforms a recipe object from frontend format to database format:
 * 1. Maps camelCase properties to snake_case database columns
 * 2. Removes properties that don't exist in the database
 * 3. Handles special cases like arrays and nested objects
 */
export function transformRecipeForDB(recipe: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  // First, apply all camelCase to snake_case mappings
  for (const [frontendKey, dbKey] of Object.entries(FIELD_MAPPINGS)) {
    if (frontendKey in recipe && recipe[frontendKey] !== undefined) {
      result[dbKey] = recipe[frontendKey];
    }
  }
  
  // Handle the description/tagline special case
  if (recipe.description !== undefined) {
    result.tagline = recipe.description;
  }
  // If both tagline and description exist, prioritize tagline
  if (recipe.tagline !== undefined) {
    result.tagline = recipe.tagline;
  }
  
  // Next, copy all other properties that don't need mapping
  for (const [key, value] of Object.entries(recipe)) {
    // Skip keys we've already mapped
    if (Object.keys(FIELD_MAPPINGS).includes(key)) {
      continue;
    }
    
    // For any property not in our mappings, copy it directly
    result[key] = value;
  }
  
  // Handle special transformations for arrays and objects
  if (result.steps && !result.instructions) {
    // Ensure steps get properly mapped to instructions (if not already)
    result.instructions = result.steps;
    delete result.steps; // Remove the duplicate after mapping
  }
  
  // Filter out any properties not in our database whitelist
  const finalResult: Record<string, any> = {};
  for (const dbField of VALID_DB_FIELDS) {
    if (dbField in result && result[dbField] !== undefined) {
      finalResult[dbField] = result[dbField];
    }
  }
  
  // Always ensure user_id is preserved
  if ('user_id' in recipe) {
    finalResult.user_id = recipe.user_id;
  }
  
  // Ensure arrays are properly formatted
  if (finalResult.flavor_tags && typeof finalResult.flavor_tags === 'string') {
    finalResult.flavor_tags = [finalResult.flavor_tags];
  }
  
  // Handle science_notes - ensure it's an array
  if (finalResult.science_notes && !Array.isArray(finalResult.science_notes)) {
    finalResult.science_notes = [finalResult.science_notes];
  }
  
  console.log("Original recipe:", recipe);
  console.log("Transformed recipe for DB:", finalResult);
  
  return finalResult;
}

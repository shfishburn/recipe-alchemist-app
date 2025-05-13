
import { QuickRecipe } from '@/types/quick-recipe';

// Define which fields are valid in the database and their mappings
const FIELD_MAPPINGS: Record<string, string> = {
  // Frontend camelCase to database snake_case mappings
  prepTime: 'prep_time_min',
  cookTime: 'cook_time_min',
  cookingTip: 'cooking_tip',
  flavorTags: 'flavor_tags',
  scienceNotes: 'science_notes',
  steps: 'instructions', // Map steps to instructions (they're the same content)
  description: 'tagline', // Map description to tagline since description doesn't exist in DB
};

// Define a whitelist of valid database column names
const VALID_DB_FIELDS = [
  'id',
  'title',
  'tagline', // Only tagline exists in DB, not description
  'ingredients',
  'instructions',
  'steps', // This will be transformed to instructions
  'servings',
  'prep_time_min',
  'cook_time_min',
  'nutrition',
  'cooking_tip',
  'cuisine',
  'dietary',
  'flavor_tags',
  'science_notes',
  'chef_notes',
  'image_url',
  'reasoning',
  'original_request',
  'version_number',
  'previous_version_id',
  'deleted_at',
  'created_at',
  'updated_at',
  'slug',
  'nutri_score',
  'cuisine_category',
  'user_id'
];

/**
 * Helper function to transform recipe data to match database schema
 */
export function transformRecipeForDB(recipe: QuickRecipe): Record<string, unknown> {
  const transformedRecipe: Record<string, unknown> = {};
  
  // Process all keys from the recipe
  for (const key in recipe) {
    // Skip null or undefined values
    if (recipe[key as keyof QuickRecipe] === null || recipe[key as keyof QuickRecipe] === undefined) {
      continue;
    }
    
    // Skip functions and unsupported types
    const value = recipe[key as keyof QuickRecipe];
    if (typeof value === 'function' || typeof value === 'symbol') {
      continue;
    }
    
    // Check if we need to remap this field
    const remappedKey = FIELD_MAPPINGS[key] || key;
    
    // Only include fields that are valid in the database
    if (VALID_DB_FIELDS.includes(remappedKey)) {
      // Special case: handle steps -> instructions mapping
      if (key === 'steps' && Array.isArray(recipe[key as keyof QuickRecipe])) {
        transformedRecipe['instructions'] = recipe[key as keyof QuickRecipe];
      } else {
        transformedRecipe[remappedKey] = recipe[key as keyof QuickRecipe];
      }
    }
  }
  
  return transformedRecipe;
}

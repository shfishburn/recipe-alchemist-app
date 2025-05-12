
/**
 * Constants for recipe saving functionality
 */

// Define which fields are valid in the database and their mappings
export const FIELD_MAPPINGS = {
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
export const VALID_DB_FIELDS = [
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


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

export function standardizeNutrition(nutrition: any) {
  if (!nutrition) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    };
  }

  // Create a new object with standardized field names
  const standardized = {
    // Base macros - ensure we have values for the required fields
    calories: getNumericValue(nutrition, ['calories', 'kcal']),
    protein: getNumericValue(nutrition, ['protein', 'protein_g']),
    carbs: getNumericValue(nutrition, ['carbs', 'carbs_g', 'carbohydrates']),
    fat: getNumericValue(nutrition, ['fat', 'fat_g']),
    fiber: getNumericValue(nutrition, ['fiber', 'fiber_g']),
    sugar: getNumericValue(nutrition, ['sugar', 'sugar_g']),
    sodium: getNumericValue(nutrition, ['sodium', 'sodium_mg']),
    
    // Optional micronutrients with standardized names
    cholesterol: getNumericValue(nutrition, ['cholesterol', 'cholesterol_mg']),
    calcium: getNumericValue(nutrition, ['calcium', 'calcium_mg']),
    iron: getNumericValue(nutrition, ['iron', 'iron_mg']),
    potassium: getNumericValue(nutrition, ['potassium', 'potassium_mg']),
    vitaminA: getNumericValue(nutrition, ['vitaminA', 'vitamin_a', 'vitamin_a_iu']),
    vitaminC: getNumericValue(nutrition, ['vitaminC', 'vitamin_c', 'vitamin_c_mg']),
    vitaminD: getNumericValue(nutrition, ['vitaminD', 'vitamin_d', 'vitamin_d_iu']),
    saturatedFat: getNumericValue(nutrition, ['saturatedFat', 'saturated_fat']),
  };

  // Copy over data quality information if it exists
  if (nutrition.data_quality) {
    standardized.data_quality = nutrition.data_quality;
  }

  // Copy any per-ingredient breakdown if it exists
  if (nutrition.per_ingredient) {
    standardized.per_ingredient = nutrition.per_ingredient;
  }

  // Preserving any other custom fields that might be useful
  if (nutrition.audit_log) {
    standardized.audit_log = nutrition.audit_log;
  }

  return standardized;
}

/**
 * Helper function to get a numeric value from multiple possible field names
 */
function getNumericValue(obj: any, fieldNames: string[]): number {
  for (const field of fieldNames) {
    if (obj[field] !== undefined) {
      const value = parseFloat(obj[field]);
      if (!isNaN(value)) {
        return value;
      }
    }
  }
  return 0; // Default to 0 if no valid value is found
}

/**
 * Validates that nutrition data has the minimum required fields
 */
export function validateNutrition(nutrition: any): boolean {
  if (!nutrition) return false;
  
  // Check for required fields
  const requiredFields = ['calories', 'protein', 'carbs', 'fat'];
  const hasRequiredFields = requiredFields.every(field => {
    const value = nutrition[field];
    return value !== undefined && value !== null && !isNaN(parseFloat(value));
  });
  
  return hasRequiredFields;
}

/**
 * Enhances science notes with standardized formatting
 */
export function standardizeScienceNotes(notes: any[]): string[] {
  if (!notes || !Array.isArray(notes)) return [];
  
  // Convert all notes to strings and filter out empty ones
  return notes
    .map(note => typeof note === 'string' ? note.trim() : String(note).trim())
    .filter(note => note.length > 0);
}

/**
 * Create a Supabase client with admin privileges
 */
export function createSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

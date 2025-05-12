
import { useState, useCallback } from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

// Define which fields are valid in the database and their mappings
const FIELD_MAPPINGS = {
  // Frontend camelCase to database snake_case mappings
  prepTime: 'prep_time_min',
  cookTime: 'cook_time_min',
  cookingTip: 'cooking_tip',
  nutritionHighlight: 'nutrition_highlight',
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
  'nutritionHighlight',
  'nutrition_highlight',
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

export function useQuickRecipeSave() {
  const [isSaving, setIsSaving] = useState(false);
  const { session } = useAuth();

  const saveRecipe = useCallback(async (recipe: QuickRecipe) => {
    try {
      setIsSaving(true);
      
      // Check if user is logged in
      if (!session?.user) {
        toast.error("You need to be logged in to save recipes");
        return;
      }
      
      // Add user ID to the recipe
      const recipeWithUser = {
        ...recipe,
        user_id: session.user.id
      };
      
      // Transform recipe for database compatibility
      const transformedRecipe = transformRecipeForDB(recipeWithUser);
      
      // Serialize the recipe to handle complex objects and ensure JSON compatibility
      const serializedRecipe = JSON.parse(JSON.stringify(transformedRecipe));
      
      // Implement robust circuit-breaker style retry logic
      const maxRetries = 3;
      let retries = 0;
      let success = false;
      
      while (retries < maxRetries && !success) {
        try {
          console.log("Saving recipe with data:", serializedRecipe);
          const { data, error } = await supabase
            .from('recipes')
            .insert(serializedRecipe)
            .select('id')
            .single();
          
          if (error) {
            console.error("Database error:", error);
            throw new Error(`Database error: ${error.message}`);
          }
          
          // Success!
          success = true;
          toast.success("Recipe saved successfully!");
          return data;
          
        } catch (err: any) {
          retries++;
          console.error(`Save attempt ${retries} failed:`, err);
          
          if (retries >= maxRetries) {
            throw err;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, retries) * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
    } catch (error: any) {
      console.error("Error saving recipe:", error);
      toast.error(`Failed to save recipe: ${error.message}`);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [session]);
  
  return { saveRecipe, isSaving };
}

/**
 * Transforms a recipe object from frontend format to database format:
 * 1. Maps camelCase properties to snake_case database columns
 * 2. Removes properties that don't exist in the database
 * 3. Handles special cases like arrays and nested objects
 */
function transformRecipeForDB(recipe: Record<string, any>): Record<string, any> {
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

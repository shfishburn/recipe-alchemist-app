import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { processRecipeUpdates } from '../process-recipe-updates';
import { transformRecipeForDb, safelyConvertToJson } from '@/utils/db-transformers';
import { ensureRecipeIntegrity } from '../validation/validate-recipe-integrity';

/**
 * Creates a new version of a recipe based on changes from an AI chat message
 * @param originalRecipe The current recipe to create a version from
 * @param chatMessage The chat message containing suggested changes
 * @returns Object with the new recipe ID and slug
 */
export async function createRecipeVersion(
  originalRecipe: Recipe,
  chatMessage: ChatMessage
): Promise<{ id: string; slug: string; version: number }> {
  // Validate inputs
  if (!originalRecipe?.id) {
    throw new Error('Invalid original recipe: missing ID');
  }
  
  if (!chatMessage?.changes_suggested && !chatMessage?.meta?.full_recipe) {
    throw new Error('Chat message contains no suggested changes or full recipe');
  }
  
  // Process the changes from chat message into the new version
  const updatedRecipe = processRecipeUpdates(originalRecipe, chatMessage);
  
  // Set versioning metadata
  const newVersionNumber = (originalRecipe.version_number || 1) + 0.1;
  updatedRecipe.version_number = parseFloat(newVersionNumber.toFixed(1)); // Format to one decimal
  updatedRecipe.previous_version_id = originalRecipe.id;
  
  // Remove the ID so we create a new record, not update
  delete updatedRecipe.id;
  
  // Ensure we keep the same user as owner
  updatedRecipe.user_id = originalRecipe.user_id;
  
  // Update the timestamps
  updatedRecipe.created_at = new Date().toISOString();
  updatedRecipe.updated_at = new Date().toISOString();
  
  // Generate a slug that indicates this is a version
  // If original has a slug, use that as a base, otherwise use the title
  const baseSlug = originalRecipe.slug || 
    originalRecipe.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  
  const versionSuffix = `-v${updatedRecipe.version_number.toString().replace('.', '-')}`;
  updatedRecipe.slug = `${baseSlug}${versionSuffix}`;
  
  // Ensure recipe integrity before database insert
  ensureRecipeIntegrity(updatedRecipe);
  
  // Transform recipe to database format
  const recipeForDb = transformRecipeForDb(updatedRecipe);
  
  console.log("Creating recipe version with transformed data:", {
    id: 'new',
    title: recipeForDb.title,
    version: recipeForDb.version_number,
    hasIngredients: recipeForDb.ingredients ? true : false,
    hasInstructions: recipeForDb.instructions ? true : false
  });
  
  // Insert the new recipe version into the database
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipeForDb)
    .select('id, slug, version_number')
    .single();
    
  if (error) {
    console.error('Error creating recipe version:', error);
    throw new Error(`Failed to create recipe version: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('No data returned after creating recipe version');
  }
  
  // Return the new recipe ID and slug for redirection
  return {
    id: data.id,
    slug: data.slug,
    version: data.version_number
  };
}

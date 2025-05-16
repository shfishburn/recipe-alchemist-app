
import type { Recipe } from '@/types/recipe';

/**
 * Comprehensive recipe data integrity validation
 * Ensures all critical fields are present and properly formatted
 */
export function validateRecipeIntegrity(recipe: Recipe | Partial<Recipe>): { 
  valid: boolean; 
  issues: string[]; 
} {
  const issues: string[] = [];
  
  // Check for required recipe fields
  if (!recipe.id) {
    issues.push("Missing recipe ID");
  }
  
  // Title validation
  if (!recipe.title || typeof recipe.title !== 'string' || recipe.title.trim() === '') {
    issues.push("Missing or invalid recipe title");
  }

  // Instructions validation
  if (!recipe.instructions) {
    issues.push("Missing recipe instructions");
  } else if (!Array.isArray(recipe.instructions)) {
    issues.push("Recipe instructions must be an array");
  } else if (recipe.instructions.length === 0) {
    issues.push("Recipe instructions array is empty");
  } else {
    // Validate each instruction
    const invalidInstructions = recipe.instructions.filter(instruction => 
      typeof instruction !== 'string' || instruction.trim() === ''
    );
    
    if (invalidInstructions.length > 0) {
      issues.push(`${invalidInstructions.length} invalid instructions found`);
    }
  }

  // Ingredients validation
  if (!recipe.ingredients) {
    issues.push("Missing recipe ingredients");
  } else if (!Array.isArray(recipe.ingredients)) {
    issues.push("Recipe ingredients must be an array");
  } else if (recipe.ingredients.length === 0) {
    issues.push("Recipe ingredients array is empty");
  } else {
    // Validate each ingredient
    const invalidIngredients = recipe.ingredients.filter(ing => 
      !ing || typeof ing !== 'object' || !ing.item || typeof ing.item !== 'string'
    );
    
    if (invalidIngredients.length > 0) {
      issues.push(`${invalidIngredients.length} invalid ingredients found`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Ensures the recipe has all required fields before saving
 * Throws an error with a detailed message if validation fails
 */
export function ensureRecipeIntegrity(recipe: Recipe | Partial<Recipe> & { id: string }): void {
  // First, check if we have a complete recipe object
  const validation = validateRecipeIntegrity(recipe as Recipe);
  
  if (!validation.valid) {
    const errorMessage = `Recipe integrity check failed: ${validation.issues.join(', ')}`;
    console.error(errorMessage, recipe);
    throw new Error(errorMessage);
  }
  
  console.log("Recipe integrity validation passed");
}

/**
 * Prepare a recipe object for processing, ensuring it has all required fields
 * Useful for handling incomplete recipe data from various sources
 */
export function prepareRecipeForProcessing(recipe: Partial<Recipe> & { id: string }): Recipe {
  // Create a base recipe with required fields
  const preparedRecipe: Recipe = {
    id: recipe.id,
    title: recipe.title || "Untitled Recipe",
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
    science_notes: Array.isArray(recipe.science_notes) ? recipe.science_notes : [],
    servings: recipe.servings || 2,
    prep_time_min: recipe.prep_time_min || 0,
    cook_time_min: recipe.cook_time_min || 0,
    updated_at: recipe.updated_at || new Date().toISOString(),
    created_at: recipe.created_at || new Date().toISOString()
  };
  
  // Add optional fields if they exist
  if (recipe.description) preparedRecipe.description = recipe.description;
  if (recipe.image_url) preparedRecipe.image_url = recipe.image_url;
  if (recipe.cuisine) preparedRecipe.cuisine = recipe.cuisine;
  if (recipe.cuisine_category) preparedRecipe.cuisine_category = recipe.cuisine_category;
  if (recipe.tags) preparedRecipe.tags = recipe.tags;
  if (recipe.user_id) preparedRecipe.user_id = recipe.user_id;
  if (recipe.nutrition) preparedRecipe.nutrition = recipe.nutrition;
  if (recipe.flavor_tags) preparedRecipe.flavor_tags = recipe.flavor_tags;
  if (recipe.chef_notes) preparedRecipe.chef_notes = recipe.chef_notes;
  if (recipe.cooking_tip) preparedRecipe.cooking_tip = recipe.cooking_tip;
  if (recipe.slug) preparedRecipe.slug = recipe.slug;
  if (recipe.nutri_score) preparedRecipe.nutri_score = recipe.nutri_score;
  if (recipe.version_info) preparedRecipe.version_info = recipe.version_info;
  if (recipe.version_id) preparedRecipe.version_id = recipe.version_id;
  
  return preparedRecipe;
}

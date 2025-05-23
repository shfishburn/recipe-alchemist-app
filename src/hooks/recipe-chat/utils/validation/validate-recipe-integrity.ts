
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
  const validation = validateRecipeIntegrity(recipe as Recipe);
  
  if (!validation.valid) {
    const errorMessage = `Recipe integrity check failed: ${validation.issues.join(', ')}`;
    console.error(errorMessage, recipe);
    throw new Error(errorMessage);
  }
  
  console.log("Recipe integrity validation passed");
}

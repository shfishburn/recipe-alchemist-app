
/**
 * Comprehensive recipe data integrity validation
 * Ensures all critical fields are present and properly formatted
 */
export function validateRecipeIntegrity(recipe: any): { 
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
    const invalidInstructions = recipe.instructions.filter((instruction: any) => 
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
    // Validate each ingredient has required fields
    const invalidIngredients = recipe.ingredients.filter((ing: any) => 
      !ing || typeof ing !== 'object' || !ing.item || 
      typeof ing.item !== 'string' || !ing.qty_metric || 
      !ing.unit_metric || !ing.qty_imperial || !ing.unit_imperial
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


/**
 * Validates that a recipe object contains all required fields
 * and that they are in the expected format
 * @param recipe The recipe object to validate
 * @throws Error if the recipe is invalid
 */
export function validateRecipeIntegrity(recipe: Record<string, any>): void {
  // Check required fields
  if (!recipe.id) {
    throw new Error("Recipe is missing ID");
  }
  
  if (!recipe.title || typeof recipe.title !== 'string') {
    throw new Error("Recipe is missing valid title");
  }
  
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    throw new Error("Recipe must have at least one ingredient");
  }
  
  if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
    throw new Error("Recipe must have at least one instruction");
  }
  
  // Validate ingredients
  for (let i = 0; i < recipe.ingredients.length; i++) {
    const ingredient = recipe.ingredients[i];
    if (typeof ingredient !== 'object' || ingredient === null) {
      throw new Error(`Ingredient ${i+1} is invalid (not an object)`);
    }
    
    if (!ingredient.item || typeof ingredient.item !== 'string') {
      throw new Error(`Ingredient ${i+1} is missing item name`);
    }
  }
  
  // Validate instructions
  for (let i = 0; i < recipe.instructions.length; i++) {
    const instruction = recipe.instructions[i];
    if (typeof instruction !== 'string' || instruction.trim() === '') {
      throw new Error(`Instruction ${i+1} is invalid (empty or not a string)`);
    }
  }
  
  // Validate science_notes if present
  if (recipe.science_notes !== undefined && recipe.science_notes !== null) {
    if (!Array.isArray(recipe.science_notes)) {
      throw new Error("science_notes must be an array");
    }
    
    for (let i = 0; i < recipe.science_notes.length; i++) {
      const note = recipe.science_notes[i];
      if (typeof note !== 'string' || note.trim() === '') {
        throw new Error(`Science note ${i+1} is invalid (empty or not a string)`);
      }
    }
  }

  // Validate basic types
  if (recipe.servings !== undefined && typeof recipe.servings !== 'number') {
    throw new Error("servings must be a number");
  }
  
  if (recipe.prep_time_min !== undefined && typeof recipe.prep_time_min !== 'number') {
    throw new Error("prep_time_min must be a number");
  }
  
  if (recipe.cook_time_min !== undefined && typeof recipe.cook_time_min !== 'number') {
    throw new Error("cook_time_min must be a number");
  }
}


// Function to validate request body parameters
export function validateRequestBody(body: any): { isValid: boolean; error?: string } {
  // Validate mainIngredient field
  if (!body.mainIngredient || typeof body.mainIngredient !== 'string' || body.mainIngredient.trim() === '') {
    return { isValid: false, error: "Main ingredient is required" };
  }
  
  // Validate servings field
  if (body.servings && (isNaN(Number(body.servings)) || Number(body.servings) <= 0)) {
    return { isValid: false, error: "Servings must be a positive number" };
  }
  
  // Validate cuisine if provided
  if (body.cuisine && typeof body.cuisine !== 'string' && !Array.isArray(body.cuisine)) {
    return { isValid: false, error: "Cuisine must be a string or array of strings" };
  }
  
  // Validate dietary if provided
  if (body.dietary && typeof body.dietary !== 'string' && !Array.isArray(body.dietary)) {
    return { isValid: false, error: "Dietary must be a string or array of strings" };
  }
  
  return { isValid: true };
}

// Function to validate recipe response structure
export function validateRecipeResponse(recipe: any): { isValid: boolean; error?: string } {
  // Check if it's an error response
  if (recipe.isError === true || recipe.error || recipe.error_message) {
    // It's a valid error response
    return { isValid: true };
  }
  
  // Check for title
  if (!recipe.title || typeof recipe.title !== 'string') {
    return { isValid: false, error: "Recipe must have a title" };
  }
  
  // Check for ingredients
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    return { isValid: false, error: "Recipe must have ingredients array" };
  }
  
  // Check for steps or instructions
  if ((!recipe.steps || !Array.isArray(recipe.steps) || recipe.steps.length === 0) && 
      (!recipe.instructions || !Array.isArray(recipe.instructions) || recipe.instructions.length === 0)) {
    return { isValid: false, error: "Recipe must have steps or instructions array" };
  }
  
  // Check servings
  if (!recipe.servings || isNaN(Number(recipe.servings)) || Number(recipe.servings) <= 0) {
    return { isValid: false, error: "Recipe must have a valid servings number" };
  }
  
  return { isValid: true };
}

// Function to check if response is a single ingredient (not a complete recipe)
export function isSingleIngredientResponse(data: any): boolean {
  return (
    data && 
    typeof data === 'object' &&
    data.item && 
    !data.title &&
    !data.ingredients &&
    (data.qty_imperial !== undefined || data.qty_metric !== undefined || data.qty !== undefined)
  );
}

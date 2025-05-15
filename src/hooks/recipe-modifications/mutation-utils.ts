import { QuickRecipe } from '@/types/quick-recipe';
import { RecipeModifications } from './types';

/**
 * Apply recipe modifications to create a new recipe object
 * Now handles both legacy partial modifications and full recipe replacements
 */
export function applyModificationsToRecipe(
  recipe: QuickRecipe, 
  modifications: RecipeModifications
): QuickRecipe {
  // If we have a complete modified recipe, use it directly
  if (modifications.modifiedRecipe) {
    console.log('Using complete modified recipe');
    // Ensure we keep the original ID and user_id
    return {
      ...modifications.modifiedRecipe,
      id: recipe.id,
      user_id: recipe.user_id
    };
  }
  
  // Legacy fallback - apply partial modifications
  console.log('Applying partial modifications');
  
  // Create a deep copy of the original recipe
  const modifiedRecipe: QuickRecipe = JSON.parse(JSON.stringify(recipe));

  // Apply title if provided
  if (modifications.modifications.title) {
    modifiedRecipe.title = modifications.modifications.title;
  }

  // Apply description if provided
  if (modifications.modifications.description) {
    modifiedRecipe.description = modifications.modifications.description;
    modifiedRecipe.tagline = modifications.modifications.description;
  }

  // Apply cooking tip if provided
  if (modifications.modifications.cookingTip) {
    modifiedRecipe.cookingTip = modifications.modifications.cookingTip;
  }

  // Apply ingredient changes if provided
  if (modifications.modifications.ingredients && modifications.modifications.ingredients.length > 0) {
    // Create a copy of the ingredients array
    const ingredientsCopy = [...modifiedRecipe.ingredients];
    
    // Apply each modification
    modifications.modifications.ingredients.forEach((modification, index) => {
      if (index < ingredientsCopy.length) {
        // Update existing ingredient
        ingredientsCopy[index] = {
          ...ingredientsCopy[index],
          item: modification.modified
        };
      }
    });
    
    // Update the recipe with modified ingredients
    modifiedRecipe.ingredients = ingredientsCopy;
  }

  // Apply step changes if provided
  if (modifications.modifications.steps && modifications.modifications.steps.length > 0) {
    // Create a copy of the steps array if it exists, or use instructions
    const stepsCopy = modifiedRecipe.steps ? [...modifiedRecipe.steps] : 
                     (modifiedRecipe.instructions ? [...modifiedRecipe.instructions] : []);
    
    // Apply each modification
    modifications.modifications.steps.forEach((modification, index) => {
      if (index < stepsCopy.length) {
        // Update existing step
        stepsCopy[index] = modification.modified;
      }
    });
    
    // Update the recipe with modified steps
    modifiedRecipe.steps = stepsCopy;
    modifiedRecipe.instructions = stepsCopy;
  }

  return modifiedRecipe;
}

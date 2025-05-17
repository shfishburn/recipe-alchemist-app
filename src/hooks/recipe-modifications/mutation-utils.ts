
import { QuickRecipe } from '@/types/quick-recipe';
import { RecipeModifications } from './types';

/**
 * Apply modifications to the recipe based on the modifications object
 * This function handles both the new complete recipe format and the legacy modifications format
 */
export function applyModifications(
  recipe: QuickRecipe,
  modifications: RecipeModifications
): QuickRecipe {
  // If we have a complete recipe in the new format, use it
  if (modifications.recipe) {
    // Ensure the recipe ID is preserved
    const completeRecipe = {
      ...modifications.recipe,
      id: recipe.id // Always preserve the original recipe ID
    };
    
    // Copy over any properties that might not be in the modification response
    return {
      ...recipe,
      ...completeRecipe
    };
  }
  
  // Fallback to legacy handling if no complete recipe
  const result = { ...recipe };
  
  // Legacy format handling - only used if modifications.recipe is not available
  if (modifications.modifications) {
    // Apply title if modified
    if (modifications.modifications.title) {
      result.title = modifications.modifications.title;
    }
    
    // Apply description if modified
    if (modifications.modifications.description) {
      result.description = modifications.modifications.description;
    }
    
    // Apply cooking tip if modified
    if (modifications.modifications.cookingTip) {
      result.cookingTip = modifications.modifications.cookingTip;
    }
    
    // Apply ingredient modifications
    if (modifications.modifications.ingredients) {
      // Process each ingredient modification
      const originalIngredients = [...recipe.ingredients];
      const updatedIngredients = [...originalIngredients];
      
      modifications.modifications.ingredients.forEach(modification => {
        if (!modification) return;
        
        // For backward compatibility, parse the ingredient text
        const ingredientText = modification.modified;
        if (!ingredientText) return;
        
        // Try to find a matching ingredient by original text
        const originalText = modification.original;
        if (originalText) {
          const index = originalIngredients.findIndex(
            ing => `${ing.qty_imperial || ing.qty || ''} ${ing.unit_imperial || ing.unit || ''} ${ing.item}`.trim() === originalText.trim()
          );
          
          if (index >= 0) {
            // Found a matching ingredient, update it
            updatedIngredients[index] = {
              ...updatedIngredients[index],
              item: ingredientText
            };
          } else {
            // No matching ingredient found, add a new one
            updatedIngredients.push({
              item: ingredientText,
              qty_imperial: 0,
              unit_imperial: '',
              qty_metric: 0,
              unit_metric: ''
            });
          }
        }
      });
      
      result.ingredients = updatedIngredients;
    }
    
    // Apply step modifications
    if (modifications.modifications.steps) {
      const steps = recipe.steps || recipe.instructions || [];
      const originalSteps = [...steps];
      const updatedSteps = [...originalSteps];
      
      modifications.modifications.steps.forEach(modification => {
        if (!modification) return;
        
        const stepText = modification.modified;
        if (!stepText) return;
        
        const originalText = modification.original;
        if (originalText) {
          // Find matching step by original text
          const index = originalSteps.findIndex(step => step.trim() === originalText.trim());
          
          if (index >= 0) {
            // Found matching step, update it
            updatedSteps[index] = stepText;
          } else {
            // No matching step, add a new one
            updatedSteps.push(stepText);
          }
        }
      });
      
      if (recipe.steps) {
        result.steps = updatedSteps;
      } else {
        result.instructions = updatedSteps;
      }
    }
  }
  
  return result;
}

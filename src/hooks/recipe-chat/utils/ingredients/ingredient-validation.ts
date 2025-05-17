
import { Recipe, Ingredient } from '@/types/recipe';
import { stringSimilarity } from '../string-utils';

interface DuplicateIngredientPair {
  existing: string;
  new: string;
  similarity: number;
}

/**
 * Finds potential duplicate ingredients when adding new ones
 */
export function findDuplicateIngredients(
  existingIngredients: Ingredient[],
  newIngredients: Ingredient[]
): DuplicateIngredientPair[] {
  const duplicates: DuplicateIngredientPair[] = [];
  const similarityThreshold = 0.7; // 70% similarity threshold
  
  // Extract ingredient names for comparison
  const existingNames = existingIngredients.map(ingredient => {
    if (typeof ingredient.item === 'string') {
      return ingredient.item.toLowerCase();
    }
    return ingredient.item.name.toLowerCase();
  });
  
  newIngredients.forEach(newIngredient => {
    const newItemName = typeof newIngredient.item === 'string' 
      ? newIngredient.item.toLowerCase() 
      : newIngredient.item.name.toLowerCase();
    
    // Compare against existing ingredients
    existingNames.forEach((existingName, index) => {
      const similarity = stringSimilarity(existingName, newItemName);
      
      if (similarity > similarityThreshold) {
        duplicates.push({
          existing: existingName,
          new: newItemName,
          similarity
        });
      }
    });
  });
  
  return duplicates;
}

/**
 * Validates ingredient quantities
 */
export function validateIngredientQuantities(
  recipe: Recipe,
  newIngredients: Ingredient[],
  mode: 'add' | 'replace' | 'none'
): { valid: boolean; message?: string } {
  // Skip validation for replace mode as we're replacing everything
  if (mode === 'replace') {
    return { valid: true };
  }
  
  // For add mode, ensure quantities are valid
  if (mode === 'add') {
    // Check if all new ingredients have at least one qty/unit pair
    const invalidIngredients = newIngredients.filter(ing => {
      // Must have at least one quantity measurement system defined
      const hasMetric = typeof ing.qty_metric === 'number' && ing.unit_metric;
      const hasImperial = typeof ing.qty_imperial === 'number' && ing.unit_imperial;
      const hasGeneric = typeof ing.qty === 'number' && ing.unit;
      
      return !(hasMetric || hasImperial || hasGeneric);
    });
    
    if (invalidIngredients.length > 0) {
      return {
        valid: false,
        message: `Some ingredients are missing measurement information`
      };
    }
  }
  
  return { valid: true };
}

/**
 * Gets the description of an ingredient for display
 */
export function getIngredientDescription(ingredient: Ingredient): string {
  if (typeof ingredient.item === 'string') {
    return ingredient.item;
  }
  
  return ingredient.item.name;
}

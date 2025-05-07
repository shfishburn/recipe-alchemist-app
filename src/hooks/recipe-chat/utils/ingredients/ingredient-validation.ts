
import type { Recipe } from '@/types/recipe';

// Enhanced ingredient name normalization for comparison
function normalizeIngredient(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/s$/, '') // Remove trailing 's' for plurals
    .replace(/^(fresh |dried |ground |powdered |minced |chopped |diced |sliced )/, ''); // Remove common preparation prefixes
}

// Improved similarity check for ingredients
export function areSimilarIngredients(ing1: string, ing2: string): boolean {
  const norm1 = normalizeIngredient(ing1);
  const norm2 = normalizeIngredient(ing2);
  
  // Direct match
  if (norm1 === norm2) return true;
  
  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  
  // Check word overlap
  const words1 = norm1.split(' ');
  const words2 = norm2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  
  // If there's significant word overlap
  if (commonWords.length > 0 && 
      commonWords.length / Math.max(words1.length, words2.length) > 0.5) {
    return true;
  }
  
  return false;
}

// More sophisticated ingredient quantity validation
export function validateIngredientQuantities(
  originalRecipe: Recipe,
  newIngredients: any[],
  mode: 'add' | 'replace' | 'none'
): { valid: boolean; message?: string } {
  if (mode === 'none' || newIngredients.length === 0) {
    return { valid: true };
  }

  // Calculate ingredients to check based on mode
  const ingredientsToCheck = mode === 'replace' ? newIngredients : [...originalRecipe.ingredients, ...newIngredients];
  
  // Check for reasonable quantities relative to serving size
  const servingSize = originalRecipe.servings || 1;
  
  for (const ing of newIngredients) {
    // Skip ingredients without proper quantity data
    if (typeof ing.qty !== 'number' || typeof ing.unit !== 'string') {
      continue;
    }
    
    const qtyPerServing = ing.qty / servingSize;
    const unit = ing.unit.toLowerCase();
    
    // Detect extreme values based on common unit types
    if ((unit.includes('cup') || unit.includes('cups')) && qtyPerServing > 3) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }
    
    if ((unit.includes('pound') || unit.includes('lb')) && qtyPerServing > 1) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }
    
    if ((unit.includes('tablespoon') || unit.includes('tbsp')) && qtyPerServing > 4) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} seems too high per serving`
      };
    }
    
    if (qtyPerServing <= 0) {
      return {
        valid: false,
        message: `Warning: ${ing.qty} ${ing.unit} of ${ing.item} has an invalid quantity`
      };
    }
  }

  return { valid: true };
}

// Enhanced duplicate ingredient detection
export function findDuplicateIngredients(existingIngredients: Recipe['ingredients'], newIngredients: Recipe['ingredients']) {
  const duplicates = [];
  
  for (const newIng of newIngredients) {
    for (const existingIng of existingIngredients) {
      if (areSimilarIngredients(existingIng.item, newIng.item)) {
        duplicates.push({
          new: newIng.item,
          existing: existingIng.item
        });
        break;
      }
    }
  }
  
  return duplicates;
}

export function findDuplicateIngredients(existingIngredients: any[], newIngredients: any[]) {
  const duplicates = [];
  
  for (const newIng of newIngredients) {
    const newItemName = typeof newIng.item === 'string' 
      ? newIng.item.toLowerCase() 
      : String(JSON.stringify(newIng.item)).toLowerCase();
      
    for (const existingIng of existingIngredients) {
      const existingItemName = typeof existingIng.item === 'string'
        ? existingIng.item.toLowerCase()
        : String(JSON.stringify(existingIng.item)).toLowerCase();
        
      // Simple string matching - future enhancement could use more sophisticated matching
      if (newItemName === existingItemName || 
          newItemName.includes(existingItemName) || 
          existingItemName.includes(newItemName)) {
        duplicates.push({
          existing: existingIng,
          new: newIng
        });
        break;
      }
    }
  }
  
  return duplicates;
}

export function validateIngredientQuantities(recipe: any, ingredients: any[], mode: string) {
  // Validate that all ingredients have valid quantities
  const invalidIngredients = ingredients.filter(ing => {
    const qty = parseFloat(String(ing.qty));
    return isNaN(qty) || qty <= 0;
  });

  if (invalidIngredients.length > 0) {
    return {
      valid: false,
      message: `Some ingredients have invalid quantities: ${invalidIngredients.map(i => typeof i.item === 'string' ? i.item : JSON.stringify(i.item)).join(', ')}`
    };
  }

  return { valid: true };
}

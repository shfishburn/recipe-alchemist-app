
// Common weight conversions for ingredients (grams)
export const WEIGHT_CONVERSIONS: Record<string, Record<string, number>> = {
  // General conversions
  general: {
    g: 1,
    kg: 1000,
    mg: 0.001,
    oz: 28.35,
    lb: 453.59,
    cup: 240, // ~240g is a general approximation for water-like substances
    tbsp: 15,  // ~15g is a general approximation
    tsp: 5,    // ~5g is a general approximation
    ml: 1,     // Assuming 1ml = 1g (true for water)
    l: 1000,   // 1L = 1000g (true for water)
  },
  
  // Specific ingredient categories
  // These values offer better precision for common ingredients
  spices: {
    tsp: 2.7,   // Most ground spices ~2-3g per teaspoon
    tbsp: 8.1,  // 3 * tsp
    cup: 129.6, // 16 * tbsp
  },
  
  herbs_dried: {
    tsp: 1.2,   // Dried herbs are lighter than ground spices
    tbsp: 3.6,  
    cup: 57.6,
  },
  
  herbs_fresh: {
    tsp: 1.6,  
    tbsp: 5,  
    cup: 60,
    bunch: 30, // Rough estimate
    sprig: 5,  // Rough estimate
  },
  
  oils: {
    tsp: 4.5,
    tbsp: 13.5,
    cup: 216,
    ml: 0.92, // Oils are typically ~8% lighter than water
  },
  
  flour: {
    tsp: 2.8,
    tbsp: 8.4,
    cup: 125,
  },
  
  sugar: {
    tsp: 4.2,
    tbsp: 12.6,
    cup: 200,
  },
  
  rice_uncooked: {
    cup: 185,
    tbsp: 12,
  },
  
  rice_cooked: {
    cup: 175,
    tbsp: 11,
  },
};

// Helper function to determine the correct conversion category based on ingredient name
function getConversionCategory(ingredientName: string): string {
  const nameLower = ingredientName.toLowerCase();
  
  // Check for spices
  if (
    nameLower.includes('spice') || 
    nameLower.includes('powder') || 
    nameLower.includes('cumin') || 
    nameLower.includes('cinnamon') || 
    nameLower.includes('paprika') || 
    nameLower.includes('pepper') ||
    nameLower.includes('chili powder') ||
    nameLower.includes('curry') ||
    nameLower.includes('nutmeg')
  ) {
    return 'spices';
  }
  
  // Check for dried herbs
  if (
    (nameLower.includes('herb') && nameLower.includes('dried')) || 
    nameLower.includes('dried oregano') || 
    nameLower.includes('dried basil') || 
    nameLower.includes('dried thyme')
  ) {
    return 'herbs_dried';
  }
  
  // Check for fresh herbs
  if (
    (nameLower.includes('herb') && !nameLower.includes('dried')) || 
    nameLower.includes('fresh basil') || 
    nameLower.includes('fresh oregano') || 
    nameLower.includes('cilantro') || 
    nameLower.includes('parsley')
  ) {
    return 'herbs_fresh';
  }
  
  // Check for oils
  if (
    nameLower.includes('oil') || 
    nameLower.includes('olive') || 
    nameLower.includes('canola') || 
    nameLower.includes('vegetable oil')
  ) {
    return 'oils';
  }
  
  // Check for flour
  if (nameLower.includes('flour')) {
    return 'flour';
  }
  
  // Check for sugar
  if (
    nameLower.includes('sugar') || 
    nameLower.includes('sweetener')
  ) {
    return 'sugar';
  }
  
  // Check for rice
  if (nameLower.includes('rice')) {
    if (nameLower.includes('cooked')) {
      return 'rice_cooked';
    }
    return 'rice_uncooked';
  }
  
  // Default to general conversions
  return 'general';
}

// Convert a quantity from any unit to grams
export function convertToGrams(
  quantity: number,
  unit: string,
  ingredientName: string
): number {
  if (!quantity || quantity <= 0) {
    return 0;
  }
  
  // Standardize unit name (remove plurals, lowercase)
  const standardUnit = unit.toLowerCase()
    .replace(/s$/, '') // Remove trailing 's' for plurals
    .replace('ounce', 'oz')
    .replace('pound', 'lb')
    .replace('gram', 'g')
    .replace('kilogram', 'kg')
    .replace('milliliter', 'ml')
    .replace('liter', 'l')
    .replace('tablespoon', 'tbsp')
    .replace('teaspoon', 'tsp');
  
  // Get the appropriate conversion category
  const category = getConversionCategory(ingredientName);
  
  // Try to find the conversion factor in the specific category
  if (WEIGHT_CONVERSIONS[category] && WEIGHT_CONVERSIONS[category][standardUnit]) {
    return quantity * WEIGHT_CONVERSIONS[category][standardUnit];
  }
  
  // Fall back to general conversions
  if (WEIGHT_CONVERSIONS.general[standardUnit]) {
    return quantity * WEIGHT_CONVERSIONS.general[standardUnit];
  }
  
  // For unknown units, return the original quantity (assuming grams)
  // This is better than returning zero, which would eliminate the ingredient
  console.warn(`Unknown unit conversion: ${quantity} ${unit} of ${ingredientName}, assuming grams`);
  return quantity;
}

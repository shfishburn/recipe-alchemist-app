
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
    pinch: 0.5, // Added for small amounts
    dash: 0.5,  // Added for small amounts
    handful: 30, // Rough estimate
    piece: 30,   // Rough estimate for a piece
    slice: 20,   // Rough estimate for a slice
  },
  
  // Specific ingredient categories
  // These values offer better precision for common ingredients
  spices: {
    tsp: 2.7,   // Most ground spices ~2-3g per teaspoon
    tbsp: 8.1,  // 3 * tsp
    cup: 129.6, // 16 * tbsp
    pinch: 0.3,  // Smaller for spices
    dash: 0.3,   // Smaller for spices
  },
  
  herbs_dried: {
    tsp: 1.2,   // Dried herbs are lighter than ground spices
    tbsp: 3.6,  
    cup: 57.6,
    pinch: 0.2,
    handful: 10,
  },
  
  herbs_fresh: {
    tsp: 1.6,  
    tbsp: 5,  
    cup: 60,
    bunch: 30, // Rough estimate
    sprig: 5,  // Rough estimate
    pinch: 0.3,
    handful: 15,
  },
  
  oils: {
    tsp: 4.5,
    tbsp: 13.5,
    cup: 216,
    ml: 0.92, // Oils are typically ~8% lighter than water
    splash: 5, // Added for common cooking terminology
    drizzle: 3, // Added for common cooking terminology
  },
  
  flour: {
    tsp: 2.8,
    tbsp: 8.4,
    cup: 125,
    handful: 25,
  },
  
  sugar: {
    tsp: 4.2,
    tbsp: 12.6,
    cup: 200,
    pinch: 0.5,
  },
  
  rice_uncooked: {
    cup: 185,
    tbsp: 12,
    handful: 30,
  },
  
  rice_cooked: {
    cup: 175,
    tbsp: 11,
    serving: 150,
  },
  
  // NEW: Added more specific categories for better conversions
  vegetables: {
    cup: 150, // Chopped vegetables
    piece: 100, // General vegetable piece
    slice: 15,  // Thin vegetable slice
    handful: 40,
  },
  
  fruits: {
    cup: 170,  // Chopped fruits
    piece: 120, // Medium fruit
    slice: 20,  // Fruit slice
    handful: 80,
  },
  
  cheese_shredded: {
    cup: 110,
    tbsp: 7,
    handful: 25,
  },
  
  cheese_cubed: {
    cup: 135,
    piece: 20, // cheese cube
    slice: 25, // cheese slice
  },
  
  nuts: {
    cup: 140,
    handful: 30,
    tbsp: 9,
  },
  
  meat: {
    cup: 225, // Cooked, diced meat
    piece: 120, // Average piece/portion
    slice: 30,  // Thin slice
    serving: 180, // Average serving
  },
  
  liquid_dairy: { // milk, cream, etc.
    cup: 245,
    tbsp: 15,
    tsp: 5,
    splash: 15,
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
    nameLower.includes('nutmeg') ||
    nameLower.includes('salt') ||
    nameLower.includes('seasoning')
  ) {
    return 'spices';
  }
  
  // Check for dried herbs
  if (
    (nameLower.includes('herb') && nameLower.includes('dried')) || 
    nameLower.includes('dried oregano') || 
    nameLower.includes('dried basil') || 
    nameLower.includes('dried thyme') ||
    nameLower.includes('dried mint') ||
    nameLower.includes('dried rosemary')
  ) {
    return 'herbs_dried';
  }
  
  // Check for fresh herbs
  if (
    (nameLower.includes('herb') && !nameLower.includes('dried')) || 
    nameLower.includes('fresh basil') || 
    nameLower.includes('fresh oregano') || 
    nameLower.includes('cilantro') || 
    nameLower.includes('parsley') ||
    nameLower.includes('mint leaves') ||
    nameLower.includes('fresh thyme') ||
    nameLower.includes('chives')
  ) {
    return 'herbs_fresh';
  }
  
  // Check for oils
  if (
    nameLower.includes('oil') || 
    nameLower.includes('olive') || 
    nameLower.includes('canola') || 
    nameLower.includes('vegetable oil') ||
    nameLower.includes('coconut oil') ||
    nameLower.includes('sesame oil') ||
    nameLower.includes('avocado oil')
  ) {
    return 'oils';
  }
  
  // Check for flour
  if (
    nameLower.includes('flour') || 
    nameLower.includes('cake mix') || 
    nameLower.includes('bread flour') || 
    nameLower.includes('pancake mix')
  ) {
    return 'flour';
  }
  
  // Check for sugar
  if (
    nameLower.includes('sugar') || 
    nameLower.includes('sweetener') ||
    nameLower.includes('honey') ||
    nameLower.includes('maple syrup') ||
    nameLower.includes('brown sugar')
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
  
  // Check for vegetables
  if (
    nameLower.includes('vegetable') ||
    nameLower.includes('carrot') ||
    nameLower.includes('broccoli') ||
    nameLower.includes('spinach') ||
    nameLower.includes('onion') ||
    nameLower.includes('potato') ||
    nameLower.includes('tomato') ||
    nameLower.includes('pepper') ||
    nameLower.includes('lettuce') ||
    nameLower.includes('cucumber') ||
    nameLower.includes('garlic') ||
    nameLower.includes('eggplant') ||
    nameLower.includes('zucchini') ||
    nameLower.includes('celery') ||
    nameLower.includes('cabbage') ||
    nameLower.includes('cauliflower') ||
    nameLower.includes('corn') ||
    nameLower.includes('mushroom')
  ) {
    return 'vegetables';
  }
  
  // Check for fruits
  if (
    nameLower.includes('fruit') ||
    nameLower.includes('apple') ||
    nameLower.includes('orange') ||
    nameLower.includes('banana') ||
    nameLower.includes('berry') ||
    nameLower.includes('strawberry') ||
    nameLower.includes('blueberry') ||
    nameLower.includes('pear') ||
    nameLower.includes('peach') ||
    nameLower.includes('plum') ||
    nameLower.includes('grape') ||
    nameLower.includes('melon') ||
    nameLower.includes('watermelon') ||
    nameLower.includes('cantaloupe') ||
    nameLower.includes('pineapple') ||
    nameLower.includes('mango')
  ) {
    return 'fruits';
  }
  
  // Check for cheese
  if (nameLower.includes('cheese')) {
    if (
      nameLower.includes('shredded') ||
      nameLower.includes('grated') ||
      nameLower.includes('shaved')
    ) {
      return 'cheese_shredded';
    }
    return 'cheese_cubed';
  }
  
  // Check for nuts
  if (
    nameLower.includes('nut') ||
    nameLower.includes('almond') ||
    nameLower.includes('peanut') ||
    nameLower.includes('walnut') ||
    nameLower.includes('cashew') ||
    nameLower.includes('pecan') ||
    nameLower.includes('hazelnut') ||
    nameLower.includes('pistachio')
  ) {
    return 'nuts';
  }
  
  // Check for meat
  if (
    nameLower.includes('meat') ||
    nameLower.includes('beef') ||
    nameLower.includes('steak') ||
    nameLower.includes('chicken') ||
    nameLower.includes('pork') ||
    nameLower.includes('ham') ||
    nameLower.includes('turkey') ||
    nameLower.includes('lamb') ||
    nameLower.includes('bacon') ||
    nameLower.includes('sausage') ||
    nameLower.includes('fish') ||
    nameLower.includes('salmon') ||
    nameLower.includes('tuna') ||
    nameLower.includes('cod') ||
    nameLower.includes('tilapia') ||
    nameLower.includes('shrimp') ||
    nameLower.includes('crab')
  ) {
    return 'meat';
  }
  
  // Check for liquid dairy
  if (
    nameLower.includes('milk') ||
    nameLower.includes('cream') ||
    nameLower.includes('yogurt') ||
    nameLower.includes('buttermilk') ||
    nameLower.includes('sour cream') ||
    nameLower.includes('half-and-half')
  ) {
    return 'liquid_dairy';
  }
  
  // Default to general conversions
  return 'general';
}

// Convert quantity from any unit to grams with enhanced support
export function convertToGrams(
  quantity: number,
  unit: string,
  ingredientName: string
): number {
  if (!quantity || quantity <= 0) {
    // Return a small default value rather than zero
    return 1;
  }
  
  // Handle nullish units
  if (!unit) {
    unit = 'piece'; // Default to piece if no unit specified
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
    .replace('teaspoon', 'tsp')
    .replace('each', 'piece')
    .replace('whole', 'piece');
  
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
  
  // Handle special cases for volumetric measurements
  if (standardUnit.includes('cup')) {
    // Handle partial cups like "1/2 cup"
    const match = standardUnit.match(/(\d+)\/(\d+)\s*cup/);
    if (match) {
      const [_, numerator, denominator] = match;
      const fraction = parseInt(numerator) / parseInt(denominator);
      // Use category-specific cup conversion or general
      const cupWeight = WEIGHT_CONVERSIONS[category]?.cup || WEIGHT_CONVERSIONS.general.cup;
      return quantity * fraction * cupWeight;
    }
  }
  
  // For common ingredient-specific units
  const itemSpecificConversions: Record<string, Record<string, number>> = {
    'onion': { 'medium': 110, 'large': 150, 'small': 70 },
    'potato': { 'medium': 150, 'large': 300, 'small': 100 },
    'carrot': { 'medium': 60, 'large': 80, 'small': 40 },
    'egg': { 'medium': 50, 'large': 60, 'small': 40, 'whole': 50 },
    'apple': { 'medium': 180, 'large': 220, 'small': 150 },
    'garlic': { 'clove': 3, 'head': 50 },
    'tomato': { 'medium': 120, 'large': 180, 'small': 80, 'cherry': 15 },
    'lemon': { 'medium': 70, 'large': 100, 'juice': 45 },
    'lime': { 'medium': 50, 'large': 70, 'juice': 30 },
    'banana': { 'medium': 120, 'large': 140, 'small': 100 },
    'bell pepper': { 'medium': 150, 'large': 200, 'small': 120 },
  };
  
  // Check for item-specific conversions
  for (const itemName in itemSpecificConversions) {
    if (ingredientName.toLowerCase().includes(itemName)) {
      const sizeConversions = itemSpecificConversions[itemName];
      for (const size in sizeConversions) {
        if (standardUnit.toLowerCase().includes(size)) {
          return quantity * sizeConversions[size];
        }
      }
    }
  }
  
  // Handle numeric units like "2-inch piece" -> treat as "piece"
  if (/\d+[\s-]?inch(es)?/.test(standardUnit)) {
    return quantity * (WEIGHT_CONVERSIONS.general.piece || 30);
  }
  
  // For unknown units, use a reasonable default
  console.warn(`Unknown unit conversion: ${quantity} ${unit} of ${ingredientName}, using default estimate`);
  return quantity * 30; // Default to 30g per "unit" - better than 1g which is too small
}

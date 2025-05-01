
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
    can: 400,    // Standard can size
    jar: 450,    // Medium jar estimate
    package: 250, // Medium package estimate
    bunch: 100,  // Medium bunch estimate
  },
  
  // Specific ingredient categories
  // These values offer better precision for common ingredients
  spices: {
    tsp: 2.7,   // Most ground spices ~2-3g per teaspoon
    tbsp: 8.1,  // 3 * tsp
    cup: 129.6, // 16 * tbsp
    pinch: 0.3,  // Smaller for spices
    dash: 0.3,   // Smaller for spices
    jar: 85,     // Small spice jar
  },
  
  herbs_dried: {
    tsp: 1.2,   // Dried herbs are lighter than ground spices
    tbsp: 3.6,  
    cup: 57.6,
    pinch: 0.2,
    handful: 10,
    jar: 25,
  },
  
  herbs_fresh: {
    tsp: 1.6,  
    tbsp: 5,  
    cup: 60,
    bunch: 30, // Rough estimate
    sprig: 5,  // Rough estimate
    pinch: 0.3,
    handful: 15,
    stem: 6,
  },
  
  oils: {
    tsp: 4.5,
    tbsp: 13.5,
    cup: 216,
    ml: 0.92, // Oils are typically ~8% lighter than water
    splash: 5, // Added for common cooking terminology
    drizzle: 3, // Added for common cooking terminology
    bottle: 750, // Standard oil bottle
  },
  
  flour: {
    tsp: 2.8,
    tbsp: 8.4,
    cup: 125,
    handful: 25,
    scoop: 30,
    package: 1000, // 1kg standard package
  },
  
  sugar: {
    tsp: 4.2,
    tbsp: 12.6,
    cup: 200,
    pinch: 0.5,
    package: 1000, // 1kg standard package
    cube: 4, // Sugar cube
  },
  
  rice_uncooked: {
    cup: 185,
    tbsp: 12,
    handful: 30,
    package: 1000, // 1kg standard package
    scoop: 45,
  },
  
  rice_cooked: {
    cup: 175,
    tbsp: 11,
    serving: 150,
    scoop: 90,
    bowl: 250,
  },
  
  vegetables: {
    cup: 150, // Chopped vegetables
    piece: 100, // General vegetable piece
    slice: 15,  // Thin vegetable slice
    handful: 40,
    head: 500, // Head of lettuce, cabbage
    floret: 30, // Broccoli/cauliflower floret
    stalk: 40,  // Celery stalk
    bulb: 60,   // Garlic bulb (vs clove)
    clove: 3,   // Garlic clove
  },
  
  fruits: {
    cup: 170,  // Chopped fruits
    piece: 120, // Medium fruit
    slice: 20,  // Fruit slice
    handful: 80,
    wedge: 30,  // Citrus wedge
    segment: 15, // Citrus segment
    zest: 6,    // Zest from one fruit
    peel: 10,   // Peel from one fruit
    small: 80,  // Small fruit
    medium: 120, // Medium fruit
    large: 170,  // Large fruit
  },
  
  cheese_shredded: {
    cup: 110,
    tbsp: 7,
    handful: 25,
    sprinkle: 5,
    package: 250, // Standard cheese package
  },
  
  cheese_cubed: {
    cup: 135,
    piece: 20, // cheese cube
    slice: 25, // cheese slice
    block: 450, // Standard cheese block
    wedge: 170, // Cheese wedge
  },
  
  nuts: {
    cup: 140,
    handful: 30,
    tbsp: 9,
    package: 250, // Standard nuts package
  },
  
  meat: {
    cup: 225, // Cooked, diced meat
    piece: 120, // Average piece/portion
    slice: 30,  // Thin slice
    serving: 180, // Average serving
    filet: 200, // Meat filet
    chop: 150,  // Pork/lamb chop
    breast: 170, // Chicken breast
    thigh: 140,  // Chicken thigh
    leg: 160,    // Chicken leg
    wing: 40,    // Chicken wing
    pound: 453.59, // 1 pound
  },
  
  liquid_dairy: { // milk, cream, etc.
    cup: 245,
    tbsp: 15,
    tsp: 5,
    splash: 15,
    glass: 250,
    bottle: 1000, // 1L bottle
    carton: 1000, // 1L carton
  },
  
  sweeteners: {
    tsp: 4.2,
    tbsp: 12.5,
    cup: 200,
    pinch: 0.5,
    drizzle: 7,
    squeeze: 10,
    packet: 5, // Sugar/sweetener packet
  },
  
  condiments: {
    tsp: 5,
    tbsp: 15,
    cup: 240,
    dash: 0.5,
    splash: 3,
    squeeze: 5,
    dollop: 10,
    bottle: 350, // Average condiment bottle
  },
  
  legumes: {
    cup: 190, // Dried
    cup_cooked: 240, // Cooked
    tbsp: 12,
    can: 400, // Standard can
    handful: 40,
  },
  
  pasta_dry: {
    cup: 100,
    handful: 80,
    serving: 85,
    pound: 453.59,
    package: 500, // Standard package
  },
  
  pasta_cooked: {
    cup: 140,
    serving: 200,
    scoop: 120,
  },
  
  bread: {
    slice: 30,
    piece: 40,
    loaf: 500,
    roll: 60,
    bun: 70,
  },
};

// Helper function to determine the correct conversion category based on ingredient name
function getConversionCategory(ingredientName: string): string {
  const nameLower = ingredientName.toLowerCase();
  
  // Check for spices - expanded list
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
    nameLower.includes('seasoning') ||
    nameLower.includes('cardamom') ||
    nameLower.includes('clove') ||
    nameLower.includes('allspice') ||
    nameLower.includes('turmeric') ||
    nameLower.includes('garam masala') ||
    nameLower.includes('cayenne')
  ) {
    return 'spices';
  }
  
  // Check for dried herbs - expanded list
  if (
    (nameLower.includes('herb') && nameLower.includes('dried')) || 
    nameLower.includes('dried oregano') || 
    nameLower.includes('dried basil') || 
    nameLower.includes('dried thyme') ||
    nameLower.includes('dried mint') ||
    nameLower.includes('dried rosemary') ||
    nameLower.includes('dried sage') ||
    nameLower.includes('dried parsley') ||
    nameLower.includes('dried dill') ||
    nameLower.includes('dried marjoram') ||
    nameLower.includes('dried tarragon')
  ) {
    return 'herbs_dried';
  }
  
  // Check for fresh herbs - expanded list
  if (
    (nameLower.includes('herb') && !nameLower.includes('dried')) || 
    nameLower.includes('fresh basil') || 
    nameLower.includes('fresh oregano') || 
    nameLower.includes('cilantro') || 
    nameLower.includes('parsley') ||
    nameLower.includes('mint leaves') ||
    nameLower.includes('fresh thyme') ||
    nameLower.includes('chives') ||
    nameLower.includes('fresh sage') ||
    nameLower.includes('fresh rosemary') ||
    nameLower.includes('fresh mint') ||
    nameLower.includes('fresh dill')
  ) {
    return 'herbs_fresh';
  }
  
  // Check for oils - expanded list
  if (
    nameLower.includes('oil') || 
    nameLower.includes('olive') || 
    nameLower.includes('canola') || 
    nameLower.includes('vegetable oil') ||
    nameLower.includes('coconut oil') ||
    nameLower.includes('sesame oil') ||
    nameLower.includes('avocado oil') ||
    nameLower.includes('sunflower oil') ||
    nameLower.includes('peanut oil') ||
    nameLower.includes('grapeseed oil')
  ) {
    return 'oils';
  }
  
  // Check for flour - expanded list
  if (
    nameLower.includes('flour') || 
    nameLower.includes('cake mix') || 
    nameLower.includes('bread flour') || 
    nameLower.includes('pancake mix') ||
    nameLower.includes('all purpose flour') ||
    nameLower.includes('wheat flour') ||
    nameLower.includes('self raising flour') ||
    nameLower.includes('cornstarch') ||
    nameLower.includes('rice flour') ||
    nameLower.includes('rye flour') ||
    nameLower.includes('almond flour')
  ) {
    return 'flour';
  }
  
  // Check for sugar and sweeteners - expanded list
  if (
    nameLower.includes('sugar') || 
    nameLower.includes('sweetener') ||
    nameLower.includes('honey') ||
    nameLower.includes('maple syrup') ||
    nameLower.includes('brown sugar') ||
    nameLower.includes('powdered sugar') ||
    nameLower.includes('confectioner') ||
    nameLower.includes('agave') ||
    nameLower.includes('stevia') ||
    nameLower.includes('molasses') ||
    nameLower.includes('corn syrup')
  ) {
    return 'sweeteners';
  }
  
  // Check for rice - expanded list
  if (
    nameLower.includes('rice') ||
    nameLower.includes('jasmine') ||
    nameLower.includes('basmati')
  ) {
    if (
      nameLower.includes('cooked') || 
      nameLower.includes('steamed') || 
      nameLower.includes('boiled')
    ) {
      return 'rice_cooked';
    }
    return 'rice_uncooked';
  }
  
  // Check for pasta
  if (
    nameLower.includes('pasta') ||
    nameLower.includes('spaghetti') ||
    nameLower.includes('fettuccine') ||
    nameLower.includes('penne') ||
    nameLower.includes('macaroni') ||
    nameLower.includes('linguine') ||
    nameLower.includes('noodle')
  ) {
    if (
      nameLower.includes('cooked') || 
      nameLower.includes('boiled')
    ) {
      return 'pasta_cooked';
    }
    return 'pasta_dry';
  }
  
  // Check for bread products
  if (
    nameLower.includes('bread') ||
    nameLower.includes('roll') ||
    nameLower.includes('bun') ||
    nameLower.includes('bagel') ||
    nameLower.includes('muffin') ||
    nameLower.includes('biscuit') ||
    nameLower.includes('croissant') ||
    nameLower.includes('toast')
  ) {
    return 'bread';
  }
  
  // Check for vegetables - expanded list
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
    nameLower.includes('mushroom') ||
    nameLower.includes('leek') ||
    nameLower.includes('kale') ||
    nameLower.includes('pea') ||
    nameLower.includes('bean') ||
    nameLower.includes('asparagus') ||
    nameLower.includes('radish')
  ) {
    return 'vegetables';
  }
  
  // Check for fruits - expanded list
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
    nameLower.includes('mango') ||
    nameLower.includes('kiwi') ||
    nameLower.includes('cherry') ||
    nameLower.includes('avocado') ||
    nameLower.includes('lemon') ||
    nameLower.includes('lime') ||
    nameLower.includes('raspberry') ||
    nameLower.includes('blackberry')
  ) {
    return 'fruits';
  }
  
  // Check for cheese - expanded list
  if (
    nameLower.includes('cheese') ||
    nameLower.includes('cheddar') ||
    nameLower.includes('mozzarella') ||
    nameLower.includes('parmesan') ||
    nameLower.includes('swiss') ||
    nameLower.includes('gouda') ||
    nameLower.includes('feta') ||
    nameLower.includes('brie') ||
    nameLower.includes('blue cheese') ||
    nameLower.includes('ricotta') ||
    nameLower.includes('cottage cheese') ||
    nameLower.includes('cream cheese')
  ) {
    if (
      nameLower.includes('shredded') ||
      nameLower.includes('grated') ||
      nameLower.includes('shaved')
    ) {
      return 'cheese_shredded';
    }
    return 'cheese_cubed';
  }
  
  // Check for nuts and seeds - expanded list
  if (
    nameLower.includes('nut') ||
    nameLower.includes('almond') ||
    nameLower.includes('peanut') ||
    nameLower.includes('walnut') ||
    nameLower.includes('cashew') ||
    nameLower.includes('pecan') ||
    nameLower.includes('hazelnut') ||
    nameLower.includes('pistachio') ||
    nameLower.includes('macadamia') ||
    nameLower.includes('seed') ||
    nameLower.includes('sesame') ||
    nameLower.includes('flaxseed') ||
    nameLower.includes('chia') ||
    nameLower.includes('sunflower seed') ||
    nameLower.includes('pumpkin seed')
  ) {
    return 'nuts';
  }
  
  // Check for meat and seafood - expanded list
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
    nameLower.includes('crab') ||
    nameLower.includes('lobster') ||
    nameLower.includes('ground beef') ||
    nameLower.includes('ground turkey') ||
    nameLower.includes('meatball') ||
    nameLower.includes('mince') ||
    nameLower.includes('filet')
  ) {
    return 'meat';
  }
  
  // Check for liquid dairy - expanded list
  if (
    nameLower.includes('milk') ||
    nameLower.includes('cream') ||
    nameLower.includes('yogurt') ||
    nameLower.includes('buttermilk') ||
    nameLower.includes('sour cream') ||
    nameLower.includes('half-and-half') ||
    nameLower.includes('heavy cream') ||
    nameLower.includes('whipping cream') ||
    nameLower.includes('almond milk') ||
    nameLower.includes('soy milk') ||
    nameLower.includes('oat milk') ||
    nameLower.includes('coconut milk')
  ) {
    return 'liquid_dairy';
  }
  
  // Check for condiments
  if (
    nameLower.includes('ketchup') ||
    nameLower.includes('mustard') ||
    nameLower.includes('mayo') ||
    nameLower.includes('sauce') ||
    nameLower.includes('dressing') ||
    nameLower.includes('vinegar') ||
    nameLower.includes('salsa') ||
    nameLower.includes('hot sauce') ||
    nameLower.includes('soy sauce') ||
    nameLower.includes('worcestershire')
  ) {
    return 'condiments';
  }
  
  // Check for legumes
  if (
    nameLower.includes('bean') ||
    nameLower.includes('lentil') ||
    nameLower.includes('chickpea') ||
    nameLower.includes('black bean') ||
    nameLower.includes('kidney bean') ||
    nameLower.includes('pinto bean') ||
    nameLower.includes('navy bean') ||
    nameLower.includes('garbanzo')
  ) {
    return 'legumes';
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
  let standardUnit = unit.toLowerCase()
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
  
  // Enhanced handling for common descriptive units
  if (standardUnit.includes('small')) {
    standardUnit = standardUnit.replace('small', '').trim();
    quantity *= 0.7; // Adjust quantity for small size
  } else if (standardUnit.includes('medium')) {
    standardUnit = standardUnit.replace('medium', '').trim();
    // No adjustment for medium as it's the baseline
  } else if (standardUnit.includes('large')) {
    standardUnit = standardUnit.replace('large', '').trim();
    quantity *= 1.5; // Adjust quantity for large size
  }
  
  // If unit becomes empty after standardization, default to piece
  if (standardUnit === '') {
    standardUnit = 'piece';
  }
  
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
  
  // Enhanced item-specific conversions table
  const itemSpecificConversions: Record<string, Record<string, number>> = {
    // Vegetables
    'onion': { 'medium': 110, 'large': 150, 'small': 70, 'chopped': 160, 'diced': 150, 'sliced': 115 },
    'potato': { 'medium': 150, 'large': 300, 'small': 100, 'cubed': 170, 'diced': 160, 'mashed': 210 },
    'carrot': { 'medium': 60, 'large': 80, 'small': 40, 'chopped': 70, 'grated': 55, 'sliced': 50 },
    'tomato': { 'medium': 120, 'large': 180, 'small': 80, 'cherry': 15, 'chopped': 160, 'diced': 150 },
    'bell pepper': { 'medium': 120, 'large': 150, 'small': 90, 'chopped': 130, 'diced': 120, 'sliced': 100 },
    'cucumber': { 'medium': 200, 'large': 300, 'small': 150, 'sliced': 180, 'diced': 170 },
    'lettuce': { 'head': 600, 'leaf': 10, 'cup': 50, 'chopped': 60 },
    'garlic': { 'clove': 3, 'head': 50, 'minced': 5, 'crushed': 4 },
    'broccoli': { 'head': 600, 'floret': 30, 'cup': 90, 'chopped': 100 },
    
    // Fruits
    'apple': { 'medium': 180, 'large': 220, 'small': 150, 'sliced': 160, 'diced': 150 },
    'banana': { 'medium': 120, 'large': 140, 'small': 100, 'sliced': 110 },
    'orange': { 'medium': 130, 'large': 150, 'small': 100, 'sliced': 115, 'juice': 240 },
    'lemon': { 'medium': 70, 'large': 100, 'juice': 45, 'zest': 6, 'sliced': 60 },
    'lime': { 'medium': 50, 'large': 70, 'juice': 30, 'zest': 4, 'sliced': 45 },
    'avocado': { 'medium': 170, 'large': 230, 'small': 130, 'mashed': 150, 'sliced': 160 },
    'strawberry': { 'medium': 12, 'large': 20, 'small': 8, 'cup': 150, 'sliced': 160 },
    'blueberry': { 'cup': 145, 'pint': 340 },
    
    // Proteins
    'egg': { 'medium': 50, 'large': 60, 'small': 40, 'whole': 50, 'yolk': 18, 'white': 32 },
    'chicken breast': { 'medium': 170, 'large': 220, 'small': 140, 'whole': 180, 'sliced': 160, 'cubed': 150 },
    'ground beef': { 'cup': 220, 'pound': 453.59, 'patty': 110 },
    'steak': { 'small': 170, 'medium': 225, 'large': 340, 'filet': 180, 'slice': 70 },
    'fish fillet': { 'small': 140, 'medium': 170, 'large': 200 },
    'bacon': { 'slice': 28, 'strip': 28, 'piece': 28 },
    'sausage': { 'link': 75, 'patty': 50, 'pound': 453.59 },
    
    // Dairy & Cheese
    'cheese': { 'slice': 25, 'cube': 15, 'cup grated': 110, 'cup shredded': 110, 'tbsp grated': 7 },
    'butter': { 'stick': 113, 'cube': 15, 'pat': 5, 'tbsp': 14 },
    'milk': { 'cup': 240, 'glass': 250, 'splash': 30 },
    'yogurt': { 'container': 170, 'cup': 245 },
    
    // Herbs & Aromatics
    'basil': { 'leaf': 0.5, 'cup leaves': 24, 'bunch': 40, 'sprig': 2 },
    'parsley': { 'sprig': 4, 'cup chopped': 60, 'bunch': 45, 'tbsp chopped': 4 },
    'cilantro': { 'sprig': 4, 'cup leaves': 16, 'bunch': 50, 'tbsp chopped': 4 },
    'mint': { 'leaf': 0.3, 'sprig': 3, 'cup leaves': 20, 'bunch': 40 },
    'rosemary': { 'sprig': 5, 'twig': 5, 'tbsp': 5, 'stem': 6 },
    'thyme': { 'sprig': 1.5, 'twig': 1.5, 'tbsp leaves': 2 },
    
    // Grains & Starches
    'rice': { 'cup uncooked': 185, 'cup cooked': 175, 'serving': 150 },
    'pasta': { 'cup dry': 100, 'cup cooked': 140, 'serving': 85, 'handful dry': 80 },
    'bread': { 'slice': 30, 'loaf': 500, 'roll': 60, 'bun': 70 },
    
    // Misc
    'honey': { 'tbsp': 21, 'tsp': 7, 'cup': 340, 'drizzle': 7 },
    'sugar': { 'cup': 200, 'tbsp': 12.5, 'tsp': 4.2, 'pinch': 0.5, 'packet': 4 },
    'flour': { 'cup': 125, 'tbsp': 8, 'tsp': 2.8 },
    'oil': { 'cup': 218, 'tbsp': 13.5, 'tsp': 4.5, 'drizzle': 5 }
  };
  
  // Check for item-specific conversions based on partial matches
  for (const itemName in itemSpecificConversions) {
    if (ingredientName.toLowerCase().includes(itemName)) {
      const sizeConversions = itemSpecificConversions[itemName];
      
      // First try exact unit match
      if (sizeConversions[standardUnit]) {
        return quantity * sizeConversions[standardUnit];
      }
      
      // Then try partial unit matches
      for (const sizeKey in sizeConversions) {
        if (standardUnit.includes(sizeKey) || sizeKey.includes(standardUnit)) {
          return quantity * sizeConversions[sizeKey];
        }
      }
    }
  }
  
  // Handle numeric units like "2-inch piece" -> treat as "piece"
  if (/\d+[\s-]?inch(es)?/.test(standardUnit)) {
    const inchMatch = standardUnit.match(/(\d+)[\s-]?inch/);
    if (inchMatch) {
      const inches = parseInt(inchMatch[1]);
      // Scale the piece weight based on inches
      const pieceWeight = WEIGHT_CONVERSIONS.general.piece || 30;
      return quantity * pieceWeight * (inches / 3); // Assuming 3 inches is standard
    }
    
    return quantity * (WEIGHT_CONVERSIONS.general.piece || 30);
  }
  
  // For unknown units, use a reasonable default based on category
  console.warn(`Unknown unit conversion: ${quantity} ${unit} of ${ingredientName}, using default estimate`);
  
  // More intelligent default based on category
  const categoryDefaults: Record<string, number> = {
    'spices': 5,
    'herbs_dried': 3,
    'herbs_fresh': 10,
    'oils': 15,
    'liquid_dairy': 30,
    'vegetables': 50,
    'fruits': 100,
    'meat': 85,
    'condiments': 15,
    'sweeteners': 10,
    'general': 30
  };
  
  return quantity * (categoryDefaults[category] || 30);
}

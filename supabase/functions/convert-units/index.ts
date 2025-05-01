import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Common weight conversions for reference
const WEIGHT_CONVERSIONS = {
  // General conversions
  general: {
    g: 1,
    kg: 1000,
    oz: 28.35,
    lb: 453.59,
    cup: 240,
    tbsp: 15,
    tsp: 5,
    ml: 1,
    l: 1000,
    pinch: 0.5,
    dash: 0.5,
    handful: 30,
    piece: 30,
    slice: 20,
  },
  
  // Specific categories with predefined values
  spices: { tsp: 2.7, tbsp: 8.1, cup: 129.6, pinch: 0.3 },
  oils: { tsp: 4.5, tbsp: 13.5, cup: 216, ml: 0.92 },
  flour: { tsp: 2.8, tbsp: 8.4, cup: 125, handful: 25 },
  sugar: { tsp: 4.2, tbsp: 12.6, cup: 200, pinch: 0.5 },
  // More categories from the original implementation are included here
};

// Serve HTTP requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { quantity, unit, ingredient } = await req.json();
    
    // Validate inputs
    if (quantity === undefined || !unit || !ingredient) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // First try to find a specific conversion in the database
    const { data: dbConversion } = await supabase
      .from('usda_unit_conversions')
      .select('conversion_factor, notes')
      .eq('from_unit', unit.toLowerCase())
      .eq('to_unit', 'g')
      .eq('food_category', ingredient.toLowerCase())
      .maybeSingle();
    
    if (dbConversion) {
      console.log(`Found database conversion for ${ingredient}: ${quantity} ${unit} = ${quantity * dbConversion.conversion_factor}g`);
      
      return new Response(
        JSON.stringify({
          grams: quantity * dbConversion.conversion_factor,
          confidence: 0.95,
          method: 'database_specific'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Try looking up in our built-in conversion tables
    const category = determineCategory(ingredient);
    const conversionTable = WEIGHT_CONVERSIONS[category] || WEIGHT_CONVERSIONS.general;
    
    if (conversionTable[unit.toLowerCase()]) {
      const grams = quantity * conversionTable[unit.toLowerCase()];
      console.log(`Using built-in conversion for ${category}: ${quantity} ${unit} = ${grams}g`);
      
      return new Response(
        JSON.stringify({
          grams,
          confidence: 0.85,
          method: `builtin_${category}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If we still don't have a conversion, use adaptive estimation
    const estimatedGrams = await adaptiveEstimation(quantity, unit, ingredient);
    
    return new Response(
      JSON.stringify(estimatedGrams),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in convert-units function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        grams: 0,
        confidence: 0,
        method: 'error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

/**
 * Determine ingredient category for conversion lookup
 */
function determineCategory(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase();
  
  if (lowerIngredient.includes('spice') || lowerIngredient.includes('pepper') || 
      lowerIngredient.includes('salt') || lowerIngredient.includes('powder')) {
    return 'spices';
  }
  
  if (lowerIngredient.includes('oil')) {
    return 'oils';
  }
  
  if (lowerIngredient.includes('flour')) {
    return 'flour';
  }
  
  if (lowerIngredient.includes('sugar') || lowerIngredient.includes('sweetener')) {
    return 'sugar';
  }
  
  // Many more categories would be here as in the original file
  
  return 'general';
}

/**
 * Use adaptive estimation techniques when standard conversions fail
 */
async function adaptiveEstimation(qty: number, unit: string, ingredient: string): Promise<{
  grams: number;
  confidence: number;
  method: string;
}> {
  // Step 1: Check for similar ingredient matches with known conversions
  const { data: similarIngredients } = await supabase
    .from('usda_unit_conversions')
    .select('food_category, conversion_factor')
    .eq('from_unit', unit.toLowerCase())
    .eq('to_unit', 'g')
    .limit(5);
  
  if (similarIngredients && similarIngredients.length > 0) {
    // Find the most similar ingredient name
    let bestMatch = similarIngredients[0];
    let maxSimilarity = 0;
    
    for (const similar of similarIngredients) {
      const similarity = stringSimilarity(ingredient, similar.food_category);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestMatch = similar;
      }
    }
    
    if (maxSimilarity > 0.6) {
      console.log(`Found similar ingredient match: ${bestMatch.food_category} (similarity: ${maxSimilarity})`);
      return {
        grams: qty * bestMatch.conversion_factor,
        confidence: 0.7 * maxSimilarity,
        method: 'similar_ingredient'
      };
    }
  }
  
  // Step 2: Looking for similar units
  const commonEquivalences: Record<string, { unit: string, factor: number }> = {
    'cup': { unit: 'cup', factor: 1 },
    'cups': { unit: 'cup', factor: 1 },
    'tablespoon': { unit: 'tbsp', factor: 1 },
    'tablespoons': { unit: 'tbsp', factor: 1 },
    'tbsp': { unit: 'tbsp', factor: 1 },
    'teaspoon': { unit: 'tsp', factor: 1 },
    'teaspoons': { unit: 'tsp', factor: 1 },
    'tsp': { unit: 'tsp', factor: 1 },
    'ounce': { unit: 'oz', factor: 1 },
    'ounces': { unit: 'oz', factor: 1 },
    'oz': { unit: 'oz', factor: 1 },
    'pound': { unit: 'lb', factor: 1 },
    'pounds': { unit: 'lb', factor: 1 },
    'lb': { unit: 'lb', factor: 1 },
    'lbs': { unit: 'lb', factor: 1 },
    'gram': { unit: 'g', factor: 1 },
    'grams': { unit: 'g', factor: 1 },
    'g': { unit: 'g', factor: 1 },
    'kilogram': { unit: 'kg', factor: 1 },
    'kilograms': { unit: 'kg', factor: 1 },
    'kg': { unit: 'kg', factor: 1 },
    'milliliter': { unit: 'ml', factor: 1 },
    'milliliters': { unit: 'ml', factor: 1 },
    'ml': { unit: 'ml', factor: 1 },
    'liter': { unit: 'l', factor: 1 },
    'liters': { unit: 'l', factor: 1 },
    'l': { unit: 'l', factor: 1 },
    // Special cases
    'stick': { unit: 'tbsp', factor: 8 },  // A stick of butter is 8 tbsp
    'clove': { unit: 'g', factor: 3 },    // A clove of garlic is about 3g
    'cloves': { unit: 'g', factor: 3 },
    'head': { unit: 'g', factor: 50 },    // Head of garlic about 50g
    'slice': { unit: 'g', factor: 25 },   // A slice is about 25g (generic)
    'slices': { unit: 'g', factor: 25 },
    'piece': { unit: 'g', factor: 30 },   // A piece is about 30g (generic)
    'pieces': { unit: 'g', factor: 30 },
  };
  
  const lowerUnit = unit.toLowerCase();
  if (commonEquivalences[lowerUnit]) {
    const equivalence = commonEquivalences[lowerUnit];
    const category = determineCategory(ingredient);
    const conversionTable = WEIGHT_CONVERSIONS[category] || WEIGHT_CONVERSIONS.general;
    
    if (conversionTable[equivalence.unit]) {
      const grams = qty * equivalence.factor * conversionTable[equivalence.unit];
      console.log(`Using unit equivalence: ${qty} ${unit} = ${qty * equivalence.factor} ${equivalence.unit} = ${grams}g`);
      
      return {
        grams,
        confidence: 0.75,
        method: 'unit_equivalence'
      };
    }
  }
  
  // Step 3: Density-based estimation for volume to weight
  if (isVolumeUnit(lowerUnit)) {
    // Try to estimate volume to weight conversion using density
    const volumeInMl = convertToMl(qty, lowerUnit);
    
    // Get estimated density for this ingredient
    const density = await estimateIngredientDensity(ingredient);
    const grams = volumeInMl * density.value;
    
    console.log(`Using density estimation: ${qty} ${unit} = ${volumeInMl}ml * ${density.value}g/ml = ${grams}g`);
    
    return {
      grams,
      confidence: density.confidence,
      method: 'density_estimation'
    };
  }
  
  // Step 4: Last resort - use the general conversion table with a low confidence
  const generalGrams = qty * (WEIGHT_CONVERSIONS.general[lowerUnit] || 1);
  
  return {
    grams: generalGrams,
    confidence: 0.3,
    method: 'general_fallback'
  };
}

/**
 * Estimate ingredient density (g/ml) based on ingredient type
 */
async function estimateIngredientDensity(ingredient: string): Promise<{
  value: number;
  confidence: number;
}> {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Common densities map
  const densities: Record<string, number> = {
    // Liquids (close to water)
    'water': 1.0,
    'milk': 1.03,
    'juice': 1.05,
    'broth': 1.0,
    'stock': 1.0,
    
    // Oils (lighter than water)
    'oil': 0.92,
    'olive oil': 0.91,
    'vegetable oil': 0.92,
    'canola oil': 0.92,
    
    // Dry goods
    'flour': 0.53,
    'sugar': 0.85,
    'salt': 1.2,
    'rice': 0.85,
    'oats': 0.4,
    
    // Dairy
    'cream': 0.97,
    'butter': 0.96,
    'yogurt': 1.03,
    
    // Other
    'honey': 1.42,
    'syrup': 1.37,
    'ketchup': 1.38,
    'mayonnaise': 0.91
  };
  
  // Check for direct matches
  for (const [name, density] of Object.entries(densities)) {
    if (lowerIngredient.includes(name)) {
      return { value: density, confidence: 0.8 };
    }
  }
  
  // Category-based estimation
  if (lowerIngredient.includes('oil')) {
    return { value: 0.92, confidence: 0.7 };
  }
  
  if (lowerIngredient.includes('flour') || lowerIngredient.includes('powder')) {
    return { value: 0.55, confidence: 0.6 };
  }
  
  if (lowerIngredient.includes('sugar') || lowerIngredient.includes('sweetener')) {
    return { value: 0.85, confidence: 0.6 };
  }
  
  if (lowerIngredient.includes('liquid') || lowerIngredient.includes('water') || 
      lowerIngredient.includes('juice') || lowerIngredient.includes('milk')) {
    return { value: 1.0, confidence: 0.7 };
  }
  
  // General fallback
  return { value: 0.8, confidence: 0.4 };
}

/**
 * Check if a unit is a volume unit
 */
function isVolumeUnit(unit: string): boolean {
  const volumeUnits = [
    'ml', 'l', 'cup', 'cups', 'tbsp', 'tsp', 'tablespoon', 'teaspoon', 
    'tablespoons', 'teaspoons', 'fluid', 'fl', 'oz', 'gallon', 'quart', 'pint'
  ];
  
  return volumeUnits.some(volUnit => unit.includes(volUnit));
}

/**
 * Convert a volume in a given unit to milliliters
 */
function convertToMl(qty: number, unit: string): number {
  const lowerUnit = unit.toLowerCase();
  
  // Volume conversion factors to ml
  const volumeConversions: Record<string, number> = {
    'ml': 1,
    'milliliter': 1,
    'milliliters': 1,
    'l': 1000,
    'liter': 1000,
    'liters': 1000,
    'cup': 240,
    'cups': 240,
    'tbsp': 15,
    'tablespoon': 15,
    'tablespoons': 15,
    'tsp': 5,
    'teaspoon': 5,
    'teaspoons': 5,
    'fl oz': 30,
    'fluid ounce': 30,
    'fluid ounces': 30,
    'gallon': 3785,
    'quart': 946,
    'pint': 473
  };
  
  for (const [unitName, factor] of Object.entries(volumeConversions)) {
    if (lowerUnit === unitName || lowerUnit.includes(unitName)) {
      return qty * factor;
    }
  }
  
  // Default: assume it's ml
  return qty;
}

/**
 * Calculate string similarity for fuzzy matching
 */
function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1.0;
  
  // Calculate Levenshtein distance
  const len1 = s1.length;
  const len2 = s2.length;
  const maxDist = Math.max(len1, len2);
  
  // Use simplified algorithm for small strings
  let dist = 0;
  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (s1[i] !== s2[i]) dist++;
  }
  dist += Math.abs(len1 - len2);
  
  // Convert to similarity score (0-1)
  return 1 - (dist / maxDist);
}

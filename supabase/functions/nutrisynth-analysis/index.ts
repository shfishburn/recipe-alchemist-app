
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Ingredient } from './types.ts';
import { convertToGrams, WEIGHT_CONVERSIONS } from './unit-conversion.ts';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Normalize ingredient text for better matching
function normalizeIngredientText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

// Find USDA food match for an ingredient with multiple strategies
async function findUsdaMatch(ingredient: string) {
  const normalizedText = normalizeIngredientText(ingredient);
  
  // Check if we already have this ingredient mapped
  const { data: cachedMapping } = await supabase
    .from('ingredient_mappings')
    .select('usda_food_code, confidence_score')
    .eq('normalized_text', normalizedText)
    .maybeSingle();
  
  if (cachedMapping) {
    console.log(`Found cached mapping for: ${ingredient}`);
    
    // Return the cached food data with the stored confidence score
    const { data: foodData } = await supabase
      .from('usda_foods')
      .select('*')
      .eq('food_code', cachedMapping.usda_food_code)
      .maybeSingle();
      
    return { 
      match: foodData, 
      confidence_score: cachedMapping.confidence_score,
      match_method: 'cached'
    };
  }
  
  // Strategy 1: Direct exact match
  const { data: exactMatches } = await supabase
    .from('usda_foods')
    .select('*')
    .ilike('food_name', normalizedText)
    .limit(1);
    
  if (exactMatches && exactMatches.length > 0) {
    // Save this mapping for future use
    await saveIngredientMapping(
      ingredient,
      normalizedText,
      exactMatches[0].food_code,
      0.95,
      'exact_match'
    );
    
    return { 
      match: exactMatches[0], 
      confidence_score: 0.95,
      match_method: 'exact_match'
    };
  }
  
  // Strategy 2: Fuzzy matching using the gin_trgm index
  // This uses the % operator which works with our pg_trgm index
  const { data: fuzzyMatches } = await supabase
    .rpc('search_foods', { 
      query_text: normalizedText,
      similarity_threshold: 0.3
    })
    .limit(5);
  
  if (fuzzyMatches && fuzzyMatches.length > 0) {
    const bestMatch = fuzzyMatches[0];
    const confidenceScore = Math.min(0.9, bestMatch.similarity);
    
    // Save this mapping for future use
    await saveIngredientMapping(
      ingredient,
      normalizedText,
      bestMatch.food_code,
      confidenceScore,
      'fuzzy_match'
    );
    
    return { 
      match: bestMatch, 
      confidence_score: confidenceScore,
      match_method: 'fuzzy_match'
    };
  }
  
  // Strategy 3: Category-based fallback
  // Extract likely food category from text
  const categories = ['fruit', 'vegetable', 'meat', 'fish', 'dairy', 'grain', 'spice', 'herb', 'oil'];
  let detectedCategory = '';
  
  for (const category of categories) {
    if (normalizedText.includes(category)) {
      detectedCategory = category;
      break;
    }
  }
  
  if (detectedCategory) {
    const { data: categoryMatches } = await supabase
      .from('usda_foods')
      .select('*')
      .ilike('food_category', `%${detectedCategory}%`)
      .limit(1);
    
    if (categoryMatches && categoryMatches.length > 0) {
      // Save this low-confidence mapping
      await saveIngredientMapping(
        ingredient,
        normalizedText,
        categoryMatches[0].food_code,
        0.5,
        'category_match'
      );
      
      return { 
        match: categoryMatches[0], 
        confidence_score: 0.5,
        match_method: 'category_match'
      };
    }
  }
  
  // No match found
  return { match: null, confidence_score: 0, match_method: 'no_match' };
}

// Save ingredient mapping to cache
async function saveIngredientMapping(
  ingredientText: string, 
  normalizedText: string, 
  usdaFoodCode: string, 
  confidenceScore: number, 
  matchMethod: string
) {
  try {
    await supabase
      .from('ingredient_mappings')
      .insert({
        ingredient_text: ingredientText,
        normalized_text: normalizedText,
        usda_food_code: usdaFoodCode,
        confidence_score: confidenceScore,
        match_method: matchMethod
      })
      .onConflict('normalized_text')
      .merge();
  } catch (error) {
    console.error('Error saving ingredient mapping:', error);
  }
}

// Calculate proper quantity scaling factor based on USDA reference weights
function calculateScalingFactor(
  ingredientQty: number, 
  ingredientUnit: string, 
  usdaData: any
): { scaleFactor: number; conversionMethod: string; ingredientGrams: number } {
  // Convert ingredient quantity to grams for consistent scaling
  const ingredientGrams = convertToGrams(ingredientQty, ingredientUnit, usdaData.food_name);
  
  // Log the conversion for debugging
  console.log(`Converting ${ingredientQty} ${ingredientUnit} of ${usdaData.food_name} to ${ingredientGrams} grams`);
  
  // USDA data is typically per 100g, but some entries have specific reference weights
  let referenceGrams = 100; // Default reference amount (100g)
  let conversionMethod = 'per_100g';
  
  // If USDA data includes a reference weight (gmwt_1), use that instead
  // This is especially important for ingredients like spices where small amounts are used
  if (usdaData.gmwt_1 && usdaData.gmwt_desc1) {
    // For spices and herbs that are typically measured in small units
    // The gmwt_1 value represents a common measure (like 1 tsp = 2.7g for many spices)
    referenceGrams = usdaData.gmwt_1;
    conversionMethod = `using_gmwt_1 (${usdaData.gmwt_desc1})`;
    
    // Convert the reference quantity to a proportion
    // Example: if 1 tsp = 2.7g, and USDA values are per 1 tsp, 
    // then for 15g of the ingredient, we need to scale by (15/2.7)
  }
  
  // Calculate scaling factor based on ingredient grams and reference weight
  const scaleFactor = ingredientGrams / referenceGrams;
  
  // Log scaling calculation for debugging
  console.log(`Scaling ${usdaData.food_name}: ${ingredientGrams}g / ${referenceGrams}g reference = ${scaleFactor} factor (${conversionMethod})`);
  
  // Sanity check - if scaling factor is unreasonable, adjust it
  if (scaleFactor > 50) {
    // This is likely an error in conversion, cap it at a reasonable value
    console.warn(`Unreasonably high scaling factor (${scaleFactor}) for ${usdaData.food_name}, capping at 50`);
    return { scaleFactor: 50, conversionMethod: `${conversionMethod}_capped`, ingredientGrams };
  }
  
  return { scaleFactor, conversionMethod, ingredientGrams };
}

// Calculate nutrition data for a list of ingredients
async function calculateNutrition(ingredients: Ingredient[], servings: number = 1) {
  console.log(`Calculating nutrition for ${ingredients.length} ingredients and ${servings} servings`);
  
  const nutritionData = {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0,
    sugar_g: 0,
    sodium_mg: 0,
    vitamin_a_iu: 0,
    vitamin_c_mg: 0,
    vitamin_d_iu: 0,
    calcium_mg: 0,
    iron_mg: 0,
    potassium_mg: 0
  };
  
  const perIngredient: Record<string, any> = {};
  const qualityMetrics = {
    matchedIngredients: 0,
    ingredientScores: [] as Array<{ingredient: string, score: number, weight: number}>,
    unmatchedIngredients: [] as string[],
    highConfidenceCount: 0,
    totalWeight: 0,
    weightedScoreSum: 0
  };

  // Track unit conversions for debugging
  const unitConversions: Array<{
    ingredient: string;
    originalQty: number;
    originalUnit: string;
    convertedGrams: number;
    scaleFactor: number;
    referenceAmount?: string;
  }> = [];
  
  // Calculate per-ingredient nutrition
  for (const ingredient of ingredients) {
    const itemName = typeof ingredient.item === 'string' 
      ? ingredient.item 
      : ingredient.item?.item || 'Unknown ingredient';
      
    // Estimate ingredient weight in recipe (rough heuristic)
    const estimatedWeight = ingredient.qty || 1;
    qualityMetrics.totalWeight += estimatedWeight;
    
    // Find match in USDA database
    const matchResult = await findUsdaMatch(itemName);
    
    if (matchResult.match) {
      qualityMetrics.matchedIngredients++;
      if (matchResult.confidence_score > 0.7) {
        qualityMetrics.highConfidenceCount++;
      }
      
      const usdaData = matchResult.match;
      
      // Calculate proper scaling factor based on USDA reference weights
      const { scaleFactor, conversionMethod, ingredientGrams } = calculateScalingFactor(
        ingredient.qty || 1, 
        ingredient.unit || 'g',
        usdaData
      );
      
      // Track this conversion for audit trail
      unitConversions.push({
        ingredient: itemName,
        originalQty: ingredient.qty || 1,
        originalUnit: ingredient.unit || 'g',
        convertedGrams: ingredientGrams,
        scaleFactor: scaleFactor,
        referenceAmount: usdaData.gmwt_desc1 || '100g'
      });
      
      // Apply scaling factor and divide by servings
      const servingFactor = scaleFactor / servings;
      
      // Calculate per-ingredient nutrition
      const ingredientNutrition = {
        item: itemName,
        calories: (usdaData.calories || 0) * servingFactor,
        protein_g: (usdaData.protein_g || 0) * servingFactor,
        carbs_g: (usdaData.carbs_g || 0) * servingFactor,
        fat_g: (usdaData.fat_g || 0) * servingFactor,
        fiber_g: (usdaData.fiber_g || 0) * servingFactor,
        sugar_g: (usdaData.sugar_g || 0) * servingFactor,
        sodium_mg: (usdaData.sodium_mg || 0) * servingFactor,
        vitamin_a_iu: (usdaData.vitamin_a_iu || 0) * servingFactor,
        vitamin_c_mg: (usdaData.vitamin_c_mg || 0) * servingFactor,
        vitamin_d_iu: (usdaData.vitamin_d_iu || 0) * servingFactor,
        calcium_mg: (usdaData.calcium_mg || 0) * servingFactor,
        iron_mg: (usdaData.iron_mg || 0) * servingFactor,
        potassium_mg: (usdaData.potassium_mg || 0) * servingFactor,
        confidence_score: matchResult.confidence_score,
        match_method: matchResult.match_method,
        scaling_info: {
          original_qty: ingredient.qty || 1,
          original_unit: ingredient.unit || 'g',
          grams_converted: ingredientGrams,
          scale_factor: scaleFactor,
          conversion_method: conversionMethod
        }
      };
      
      // Store per-ingredient nutrition
      perIngredient[itemName] = ingredientNutrition;
      
      // Add to total nutrition
      Object.keys(nutritionData).forEach(key => {
        nutritionData[key as keyof typeof nutritionData] += 
          ingredientNutrition[key as keyof typeof ingredientNutrition] || 0;
      });
      
      // Track confidence metrics
      qualityMetrics.ingredientScores.push({
        ingredient: itemName,
        score: matchResult.confidence_score,
        weight: estimatedWeight
      });
      
      qualityMetrics.weightedScoreSum += matchResult.confidence_score * estimatedWeight;
    } else {
      qualityMetrics.unmatchedIngredients.push(itemName);
    }
  }
  
  // Calculate weighted average confidence score
  let overallConfidenceScore = 0;
  if (qualityMetrics.totalWeight > 0) {
    overallConfidenceScore = qualityMetrics.weightedScoreSum / qualityMetrics.totalWeight;
  }
  
  // Apply penalties to confidence score
  let penalizedScore = overallConfidenceScore;
  const penalties = {
    energy_check_fail: false,
    unmatched_ingredients_rate: qualityMetrics.unmatchedIngredients.length / ingredients.length,
    low_confidence_top_ingredients: false
  };
  
  // Penalize for unmatched ingredients
  if (penalties.unmatched_ingredients_rate > 0.25) {
    penalizedScore *= (1 - penalties.unmatched_ingredients_rate / 2);
  }
  
  // Determine overall confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
  if (penalizedScore >= 0.8) {
    confidenceLevel = 'high';
  } else if (penalizedScore >= 0.6) {
    confidenceLevel = 'medium';
  }
  
  // Apply minimal validation using Atwater factors
  const calculated_calories = 
    (nutritionData.protein_g * 4) + 
    (nutritionData.carbs_g * 4) + 
    (nutritionData.fat_g * 9);
  
  // If there's more than 20% difference, mark as energy check failed
  if (nutritionData.calories > 0 && 
      Math.abs(calculated_calories - nutritionData.calories) / nutritionData.calories > 0.2) {
    penalties.energy_check_fail = true;
    penalizedScore *= 0.8;
  }
  
  // Apply sanity check to the final nutrition values
  // Round all values appropriately
  Object.keys(nutritionData).forEach(key => {
    const value = nutritionData[key as keyof typeof nutritionData];
    
    // Round to appropriate precision based on nutrient type
    if (key.includes('_mg')) {
      // Round milligram values to whole numbers
      nutritionData[key as keyof typeof nutritionData] = Math.round(value);
    } else if (key === 'calories') {
      // Round calories to whole numbers
      nutritionData[key as keyof typeof nutritionData] = Math.round(value);
    } else {
      // Round other values (g) to 1 decimal place
      nutritionData[key as keyof typeof nutritionData] = Math.round(value * 10) / 10;
    }
  });
  
  // Build final enhanced nutrition object
  const enhancedNutrition = {
    ...nutritionData,
    data_quality: {
      overall_confidence: confidenceLevel,
      overall_confidence_score: penalizedScore,
      penalties,
      unmatched_or_low_confidence_ingredients: qualityMetrics.unmatchedIngredients,
      limitations: []
    },
    per_ingredient: perIngredient,
    audit_log: {
      confidence_calculation: {
        ingredient_scores: qualityMetrics.ingredientScores,
        penalties_applied: [
          { reason: 'unmatched_ingredients', multiplier: 1 - penalties.unmatched_ingredients_rate / 2 },
          { reason: 'energy_check', multiplier: penalties.energy_check_fail ? 0.8 : 1 }
        ],
        final_calculation: `${overallConfidenceScore} × penalties = ${penalizedScore}`
      },
      unit_conversions: unitConversions,
      yield_sources: {}
    }
  };
  
  return enhancedNutrition;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { ingredients, servings } = await req.json();
    
    if (!ingredients || !Array.isArray(ingredients)) {
      throw new Error('Invalid request: ingredients array is required');
    }
    
    console.log(`Received request to analyze ${ingredients.length} ingredients`);
    
    // Calculate nutrition data
    const enhancedNutrition = await calculateNutrition(
      ingredients,
      servings || 1
    );
    
    return new Response(
      JSON.stringify(enhancedNutrition),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in nutrisynth-analysis function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});

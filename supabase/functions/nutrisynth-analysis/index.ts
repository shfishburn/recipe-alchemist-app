
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Ingredient } from './types.ts';

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
  
  // Try finding a match in the USDA raw data first - this is our new enhanced approach
  try {
    // Use the search_usda_foods function we created in the SQL migration
    const { data: rawMatches, error } = await supabase
      .rpc('search_usda_foods', {
        query_text: normalizedText,
        similarity_threshold: 0.3
      });
    
    if (!error && rawMatches && rawMatches.length > 0) {
      // Use the best raw match
      const bestRawMatch = rawMatches[0];
      
      // Get unit conversion data if available
      const { data: conversionData } = await supabase
        .from('usda_raw.food_portions')
        .select(`
          id, 
          amount, 
          gram_weight,
          modifier,
          portion_description,
          measure_unit_id,
          measure_unit:measure_unit_id (name)
        `)
        .eq('fdc_id', bestRawMatch.fdc_id)
        .limit(1);
        
      // High confidence for USDA raw data matches
      const confidenceScore = Math.min(0.95, bestRawMatch.similarity);
      
      // Save this mapping for future use with a higher confidence since it's from the official USDA data
      await saveIngredientMapping(
        ingredient,
        normalizedText,
        bestRawMatch.fdc_id.toString(),
        confidenceScore,
        'usda_raw_match'
      );
      
      // Create a synthetic match object that mimics our standard usda_foods table
      const syntheticMatch = {
        food_name: bestRawMatch.description,
        food_code: bestRawMatch.fdc_id.toString(),
        // We don't have nutrition data yet from the raw tables, but indicate this is from raw data
        source: 'usda_raw',
        portion_info: conversionData?.[0] || null
      };
      
      return {
        match: syntheticMatch,
        confidence_score: confidenceScore,
        match_method: 'usda_raw_match'
      };
    }
  } catch (rawMatchError) {
    console.error('Error searching USDA raw data:', rawMatchError);
    // Continue to standard matching if raw matching fails
  }
  
  // Our standard matching strategies continue from here
  
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

// Find cooking yield factor for an ingredient and cooking method
async function findYieldFactor(ingredient: string, cookingMethod: string): Promise<number | null> {
  if (!ingredient || !cookingMethod) return null;
  
  const normalizedIngredient = normalizeIngredientText(ingredient);
  const normalizedMethod = normalizeIngredientText(cookingMethod);
  
  try {
    // Try to find an exact match first
    const { data: exactMatches } = await supabase
      .from('usda_raw.yield_factors')
      .select('yield_factor')
      .ilike('ingredient', normalizedIngredient)
      .ilike('cooking_method', normalizedMethod)
      .limit(1);
      
    if (exactMatches && exactMatches.length > 0) {
      return exactMatches[0].yield_factor;
    }
    
    // Try with just the ingredient (any cooking method)
    const { data: ingredientMatches } = await supabase
      .from('usda_raw.yield_factors')
      .select('yield_factor')
      .ilike('ingredient', normalizedIngredient)
      .limit(1);
      
    if (ingredientMatches && ingredientMatches.length > 0) {
      return ingredientMatches[0].yield_factor;
    }
    
    // Try with general food category and specific cooking method
    const categories = ['fruit', 'vegetable', 'meat', 'fish', 'poultry', 'grain'];
    let detectedCategory = null;
    
    for (const category of categories) {
      if (normalizedIngredient.includes(category)) {
        detectedCategory = category;
        break;
      }
    }
    
    if (detectedCategory) {
      const { data: categoryMatches } = await supabase
        .from('usda_raw.yield_factors')
        .select('yield_factor')
        .ilike('food_category', detectedCategory)
        .ilike('cooking_method', normalizedMethod)
        .limit(1);
        
      if (categoryMatches && categoryMatches.length > 0) {
        return categoryMatches[0].yield_factor;
      }
      
      // Try with just the category (any cooking method)
      const { data: categoryOnlyMatches } = await supabase
        .from('usda_raw.yield_factors')
        .select('yield_factor')
        .ilike('food_category', detectedCategory)
        .limit(1);
        
      if (categoryOnlyMatches && categoryOnlyMatches.length > 0) {
        return categoryOnlyMatches[0].yield_factor;
      }
    }
  } catch (error) {
    console.error('Error finding yield factor:', error);
  }
  
  // No yield factor found
  return null;
}

// Find unit conversion for an ingredient
async function findUnitConversion(ingredient: string, fromUnit: string): Promise<number | null> {
  if (!ingredient || !fromUnit) return null;
  
  const normalizedIngredient = normalizeIngredientText(ingredient);
  const normalizedUnit = normalizeIngredientText(fromUnit);
  
  try {
    // Check if we have specific conversion data from the USDA raw data
    // This would use the views we created in the database schema
    const { data: conversionMatches } = await supabase
      .from('usda.unit_conversions')
      .select('grams_per_unit, food_name')
      .ilike('food_name', `%${normalizedIngredient}%`)
      .ilike('from_unit', normalizedUnit)
      .limit(1);
      
    if (conversionMatches && conversionMatches.length > 0) {
      return conversionMatches[0].grams_per_unit;
    }
    
    // Fall back to standard unit conversions
    const { data: fallbackMatches } = await supabase
      .from('usda_unit_conversions')
      .select('conversion_factor')
      .ilike('from_unit', normalizedUnit)
      .eq('to_unit', 'g')
      .limit(1);
      
    if (fallbackMatches && fallbackMatches.length > 0) {
      return fallbackMatches[0].conversion_factor;
    }
  } catch (error) {
    console.error('Error finding unit conversion:', error);
  }
  
  // No conversion found
  return null;
}

// Calculate nutrition data for a list of ingredients
async function calculateNutrition(ingredients: Ingredient[], servings: number = 1, cookingMethod: string = '') {
  console.log(`Calculating nutrition for ${ingredients.length} ingredients and ${servings} servings`);
  console.log(`Cooking method: ${cookingMethod || 'not specified'}`);
  
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
  
  const auditLog = {
    confidence_calculation: {
      ingredient_scores: [] as Array<{ingredient: string, score: number, weight: number}>,
      penalties_applied: [] as Array<{reason: string, multiplier: number}>,
      final_calculation: ''
    },
    unit_conversions: {} as Record<string, any>,
    yield_factors: {} as Record<string, any>
  };
  
  // Calculate per-ingredient nutrition
  for (const ingredient of ingredients) {
    const itemName = typeof ingredient.item === 'string' 
      ? ingredient.item 
      : ingredient.item.item || 'Unknown ingredient';
      
    const unit = ingredient.unit || '';
      
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
      
      // Apply unit conversion if available
      let unitConversion = 1.0;  // Default conversion factor
      if (unit) {
        const conversionFactor = await findUnitConversion(itemName, unit);
        if (conversionFactor !== null) {
          unitConversion = conversionFactor;
          auditLog.unit_conversions[itemName] = {
            from: unit,
            to: 'g',
            factor: conversionFactor
          };
        }
      }
      
      // Apply cooking yield factor if cooking method is specified
      let yieldFactor = 1.0;  // Default yield factor (no change)
      if (cookingMethod) {
        const foundYieldFactor = await findYieldFactor(itemName, cookingMethod);
        if (foundYieldFactor !== null) {
          yieldFactor = foundYieldFactor;
          auditLog.yield_factors[itemName] = {
            cooking_method: cookingMethod,
            factor: foundYieldFactor
          };
        }
      }
      
      // Apply quantity/portion scaling factor
      // This applies unit conversion and yield factor
      const scaleFactor = ((ingredient.qty || 1) * unitConversion * yieldFactor) / servings;
      
      // Calculate per-ingredient nutrition
      const ingredientNutrition = {
        item: itemName,
        calories: (usdaData.calories || 0) * scaleFactor,
        protein_g: (usdaData.protein_g || 0) * scaleFactor,
        carbs_g: (usdaData.carbs_g || 0) * scaleFactor,
        fat_g: (usdaData.fat_g || 0) * scaleFactor,
        fiber_g: (usdaData.fiber_g || 0) * scaleFactor,
        sugar_g: (usdaData.sugar_g || 0) * scaleFactor,
        sodium_mg: (usdaData.sodium_mg || 0) * scaleFactor,
        vitamin_a_iu: (usdaData.vitamin_a_iu || 0) * scaleFactor,
        vitamin_c_mg: (usdaData.vitamin_c_mg || 0) * scaleFactor,
        vitamin_d_iu: (usdaData.vitamin_d_iu || 0) * scaleFactor,
        calcium_mg: (usdaData.calcium_mg || 0) * scaleFactor,
        iron_mg: (usdaData.iron_mg || 0) * scaleFactor,
        potassium_mg: (usdaData.potassium_mg || 0) * scaleFactor,
        confidence_score: matchResult.confidence_score,
        match_method: matchResult.match_method
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
    auditLog.confidence_calculation.penalties_applied.push({
      reason: 'unmatched_ingredients',
      multiplier: 1 - penalties.unmatched_ingredients_rate / 2
    });
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
    auditLog.confidence_calculation.penalties_applied.push({
      reason: 'energy_check',
      multiplier: 0.8
    });
  }
  
  auditLog.confidence_calculation.ingredient_scores = qualityMetrics.ingredientScores;
  auditLog.confidence_calculation.final_calculation = `${overallConfidenceScore.toFixed(2)} × penalties = ${penalizedScore.toFixed(2)}`;
  
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
    audit_log: auditLog
  };
  
  return enhancedNutrition;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { ingredients, servings, cookingMethod } = await req.json();
    
    if (!ingredients || !Array.isArray(ingredients)) {
      throw new Error('Invalid request: ingredients array is required');
    }
    
    console.log(`Received request to analyze ${ingredients.length} ingredients`);
    
    // Calculate nutrition data
    const enhancedNutrition = await calculateNutrition(
      ingredients,
      servings || 1,
      cookingMethod || ''
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

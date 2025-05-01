
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Ingredient } from './types.ts';
import { convertToGrams, WEIGHT_CONVERSIONS } from './unit-conversion.ts';
import { normalizeIngredientText, buildIngredientAliases } from './ingredient-helpers.ts';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Find USDA food match for an ingredient with enhanced matching strategies
async function findUsdaMatch(ingredient: string) {
  const normalizedText = normalizeIngredientText(ingredient);
  
  console.log(`Finding match for: "${ingredient}" (normalized: "${normalizedText}")`);
  
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
  
  // Generate possible variations of the ingredient text
  const aliases = buildIngredientAliases(normalizedText);
  
  // Strategy 1: Try exact match on any of the aliases
  for (const alias of aliases) {
    const { data: exactMatches } = await supabase
      .from('usda_foods')
      .select('*')
      .ilike('food_name', alias)
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
      
      console.log(`Found exact match for "${ingredient}": ${exactMatches[0].food_name}`);
      
      return { 
        match: exactMatches[0], 
        confidence_score: 0.95,
        match_method: 'exact_match'
      };
    }
  }
  
  // Strategy 2: Enhanced fuzzy matching using the gin_trgm index with reduced threshold
  // Lower threshold from 0.3 to 0.25 to increase match rate
  const { data: fuzzyMatches } = await supabase
    .rpc('search_foods', { 
      query_text: normalizedText,
      similarity_threshold: 0.25
    })
    .limit(8);  // Increase from 5 to 8 to get more candidates
  
  if (fuzzyMatches && fuzzyMatches.length > 0) {
    // Apply additional scoring to find the best match among candidates
    const scoredMatches = fuzzyMatches.map(match => {
      // Base score is the similarity value
      let score = match.similarity;
      
      // Boost score if the ingredient name appears at the beginning of the match
      if (match.food_name.toLowerCase().startsWith(normalizedText)) {
        score += 0.1;
      }
      
      // Boost score if all words in the ingredient are found in the match
      const ingredientWords = normalizedText.split(' ');
      const matchWords = match.food_name.toLowerCase().split(' ');
      const allWordsFound = ingredientWords.every(word => 
        matchWords.some(matchWord => matchWord.includes(word))
      );
      if (allWordsFound) {
        score += 0.05;
      }
      
      return {
        ...match,
        enhanced_score: Math.min(0.98, score) // Cap at 0.98
      };
    });
    
    // Sort by enhanced score
    scoredMatches.sort((a, b) => b.enhanced_score - a.enhanced_score);
    
    const bestMatch = scoredMatches[0];
    const confidenceScore = bestMatch.enhanced_score;
    
    console.log(`Found fuzzy match for "${ingredient}": ${bestMatch.food_name} (score: ${confidenceScore.toFixed(2)})`);
    
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
  
  // Strategy 3: Word-order-independent matching
  // Try matching with reversed words for common patterns like "olive oil" vs "oil, olive"
  const reversedWords = normalizedText.split(' ').reverse().join(' ');
  
  if (reversedWords !== normalizedText) {
    const { data: reversedMatches } = await supabase
      .rpc('search_foods', { 
        query_text: reversedWords,
        similarity_threshold: 0.25
      })
      .limit(3);
      
    if (reversedMatches && reversedMatches.length > 0) {
      const bestMatch = reversedMatches[0];
      const confidenceScore = Math.min(0.85, bestMatch.similarity);
      
      console.log(`Found word-order-independent match for "${ingredient}": ${bestMatch.food_name} (score: ${confidenceScore.toFixed(2)})`);
      
      // Save this mapping for future use
      await saveIngredientMapping(
        ingredient,
        normalizedText,
        bestMatch.food_code,
        confidenceScore,
        'word_order_match'
      );
      
      return { 
        match: bestMatch, 
        confidence_score: confidenceScore,
        match_method: 'word_order_match'
      };
    }
  }
  
  // Strategy 4: Category-based fallback with enhanced logic
  // Extract likely food category from text with more sophisticated categorization
  const categories = [
    { name: 'fruit', keywords: ['apple', 'banana', 'berry', 'berries', 'fruit', 'citrus', 'orange', 'lemon'] },
    { name: 'vegetable', keywords: ['vegetable', 'carrot', 'onion', 'garlic', 'broccoli', 'spinach', 'pepper', 'tomato', 'potato'] },
    { name: 'meat', keywords: ['meat', 'beef', 'steak', 'chicken', 'pork', 'turkey', 'lamb', 'sausage'] },
    { name: 'fish', keywords: ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'seafood', 'shrimp', 'crab'] },
    { name: 'dairy', keywords: ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'dairy'] },
    { name: 'grain', keywords: ['grain', 'flour', 'rice', 'pasta', 'bread', 'cereal', 'oat', 'wheat'] },
    { name: 'spice', keywords: ['spice', 'pepper', 'salt', 'cinnamon', 'cumin', 'paprika', 'herb'] },
    { name: 'oil', keywords: ['oil', 'olive', 'vegetable oil', 'canola', 'sesame'] },
    { name: 'nut', keywords: ['nut', 'peanut', 'almond', 'cashew', 'pecan', 'walnut'] }
  ];
  
  let detectedCategory = '';
  let highestKeywordCount = 0;
  
  for (const category of categories) {
    const keywordMatches = category.keywords.filter(keyword => 
      normalizedText.includes(keyword)
    ).length;
    
    if (keywordMatches > highestKeywordCount) {
      detectedCategory = category.name;
      highestKeywordCount = keywordMatches;
    }
  }
  
  if (detectedCategory) {
    console.log(`Detected category "${detectedCategory}" for ingredient "${ingredient}"`);
    
    const { data: categoryMatches } = await supabase
      .from('usda_foods')
      .select('*')
      .ilike('food_name', `%${detectedCategory}%`)
      .limit(1);
    
    if (categoryMatches && categoryMatches.length > 0) {
      // Save this low-confidence mapping
      await saveIngredientMapping(
        ingredient,
        normalizedText,
        categoryMatches[0].food_code,
        0.6,
        'category_match'
      );
      
      console.log(`Found category match for "${ingredient}": ${categoryMatches[0].food_name}`);
      
      return { 
        match: categoryMatches[0], 
        confidence_score: 0.6,
        match_method: 'category_match'
      };
    }
  }
  
  // Strategy 5: Generic food type fallback (last resort)
  // If we've gotten here, try to find a generic version of the ingredient
  const genericTerms = ['basic', 'raw', 'fresh', 'standard', 'plain', 'simple'];
  
  for (const term of genericTerms) {
    const { data: genericMatches } = await supabase
      .from('usda_foods')
      .select('*')
      .ilike('food_name', `%${term}%`)
      .limit(1);
    
    if (genericMatches && genericMatches.length > 0) {
      await saveIngredientMapping(
        ingredient,
        normalizedText,
        genericMatches[0].food_code,
        0.4,
        'generic_match'
      );
      
      console.log(`Found generic fallback match for "${ingredient}": ${genericMatches[0].food_name}`);
      
      return { 
        match: genericMatches[0], 
        confidence_score: 0.4,
        match_method: 'generic_match'
      };
    }
  }
  
  // No match found
  console.log(`No match found for ingredient: "${ingredient}"`);
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
// with enhanced support for various units and ingredient-specific factors
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
  }
  
  // Calculate scaling factor based on ingredient grams and reference weight
  let scaleFactor = ingredientGrams / referenceGrams;
  
  // Log scaling calculation for debugging
  console.log(`Scaling ${usdaData.food_name}: ${ingredientGrams}g / ${referenceGrams}g reference = ${scaleFactor} factor (${conversionMethod})`);
  
  // Enhanced sanity checks
  if (scaleFactor <= 0 || isNaN(scaleFactor)) {
    console.warn(`Invalid scaling factor (${scaleFactor}) for ${usdaData.food_name}, using minimum value`);
    scaleFactor = 0.1; // Minimum scale factor to ensure some values
  }
  
  // If scaling factor is unreasonably high, adjust it
  if (scaleFactor > 50) {
    console.warn(`Unreasonably high scaling factor (${scaleFactor}) for ${usdaData.food_name}, capping at 50`);
    scaleFactor = 50;
    conversionMethod = `${conversionMethod}_capped`;
  }
  
  return { scaleFactor, conversionMethod, ingredientGrams };
}

// Calculate nutrition data for a list of ingredients
async function calculateNutrition(ingredients: Ingredient[], servings: number = 1) {
  console.log(`Calculating nutrition for ${ingredients.length} ingredients and ${servings} servings`);
  
  // Initialize nutrition data with all required fields set to 0
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
  
  // Track per-ingredient nutrition data
  const perIngredient: Record<string, any> = {};
  
  // Track quality metrics
  const qualityMetrics = {
    matchedIngredients: 0,
    ingredientScores: [] as Array<{ingredient: string, score: number, weight: number}>,
    unmatchedIngredients: [] as string[],
    unmatchedIngredientSuggestions: {} as Record<string, string[]>,
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
    // Enhanced item name extraction with fallbacks
    let itemName: string;
    
    if (typeof ingredient === 'string') {
      itemName = ingredient;
    } else if (typeof ingredient.item === 'string') {
      itemName = ingredient.item;
    } else if (ingredient.item?.item && typeof ingredient.item.item === 'string') {
      itemName = ingredient.item.item;
    } else {
      itemName = 'Unknown ingredient';
    }
    
    // Estimate ingredient weight in recipe (rough heuristic)
    // Default to 1 if quantity is missing, with a minimum of 0.1
    const qty = (ingredient.qty !== undefined && ingredient.qty !== null) ? 
                Math.max(0.1, ingredient.qty) : 1;
    
    // Track for quality metrics
    qualityMetrics.totalWeight += qty;
    
    // Find match in USDA database
    const matchResult = await findUsdaMatch(itemName);
    
    if (matchResult.match) {
      qualityMetrics.matchedIngredients++;
      if (matchResult.confidence_score > 0.7) {
        qualityMetrics.highConfidenceCount++;
      }
      
      const usdaData = matchResult.match;
      
      // Calculate proper scaling factor based on USDA reference weights
      const unit = typeof ingredient === 'string' ? 'g' : (ingredient.unit || 'g');
      const { scaleFactor, conversionMethod, ingredientGrams } = calculateScalingFactor(
        qty, 
        unit,
        usdaData
      );
      
      // Track this conversion for audit trail
      unitConversions.push({
        ingredient: itemName,
        originalQty: qty,
        originalUnit: unit,
        convertedGrams: ingredientGrams,
        scaleFactor: scaleFactor,
        referenceAmount: usdaData.gmwt_desc1 || '100g'
      });
      
      // Apply scaling factor and divide by servings
      const servingFactor = scaleFactor / Math.max(1, servings);
      
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
        matched_food: usdaData.food_name,
        scaling_info: {
          original_qty: qty,
          original_unit: unit,
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
        weight: qty
      });
      
      qualityMetrics.weightedScoreSum += matchResult.confidence_score * qty;
    } else {
      qualityMetrics.unmatchedIngredients.push(itemName);
      
      // Generate suggestions for unmatched ingredients
      const suggestions = await generateIngredientSuggestions(itemName);
      if (suggestions.length > 0) {
        qualityMetrics.unmatchedIngredientSuggestions[itemName] = suggestions;
      }
      
      // Add fallback nutrition values for unmatched ingredients
      const fallbackValues = estimateFallbackNutrition(itemName, qty);
      
      // Store fallback nutrition in per-ingredient data
      perIngredient[itemName] = {
        item: itemName,
        ...fallbackValues,
        confidence_score: 0.2,
        match_method: 'fallback_estimation',
        is_fallback: true,
        scaling_info: {
          original_qty: qty,
          original_unit: typeof ingredient === 'string' ? 'g' : (ingredient.unit || 'g')
        }
      };
      
      // Add fallback values to totals
      Object.keys(fallbackValues).forEach(key => {
        if (nutritionData[key as keyof typeof nutritionData] !== undefined) {
          nutritionData[key as keyof typeof nutritionData] += 
            fallbackValues[key as keyof typeof fallbackValues] || 0;
        }
      });
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
  
  // Ensure minimum thresholds for critical nutrients
  const minThresholds = {
    calories: 50,
    protein_g: 1,
    carbs_g: 1,
    fat_g: 0.5
  };
  
  let appliedMinimumThresholds = false;
  
  // Apply minimum thresholds only if we have some ingredients but very low values
  if (ingredients.length > 0) {
    for (const [nutrient, threshold] of Object.entries(minThresholds)) {
      if (nutritionData[nutrient as keyof typeof nutritionData] < threshold) {
        nutritionData[nutrient as keyof typeof nutritionData] = threshold;
        appliedMinimumThresholds = true;
      }
    }
  }
  
  // Determine overall confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
  if (penalizedScore >= 0.8) {
    confidenceLevel = 'high';
  } else if (penalizedScore >= 0.6) {
    confidenceLevel = 'medium';
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
  
  // Build final enhanced nutrition object with all variants of field names for compatibility
  const enhancedNutrition = {
    ...nutritionData,
    // Map to standardized field names for compatibility
    calories: nutritionData.calories,
    protein: nutritionData.protein_g,
    carbs: nutritionData.carbs_g,
    fat: nutritionData.fat_g,
    fiber: nutritionData.fiber_g,
    sugar: nutritionData.sugar_g,
    sodium: nutritionData.sodium_mg,
    vitamin_a: nutritionData.vitamin_a_iu,
    vitamin_c: nutritionData.vitamin_c_mg,
    vitamin_d: nutritionData.vitamin_d_iu,
    calcium: nutritionData.calcium_mg,
    iron: nutritionData.iron_mg,
    potassium: nutritionData.potassium_mg,
    data_quality: {
      overall_confidence: confidenceLevel,
      overall_confidence_score: penalizedScore,
      penalties,
      unmatched_or_low_confidence_ingredients: qualityMetrics.unmatchedIngredients,
      unmatched_ingredient_suggestions: qualityMetrics.unmatchedIngredientSuggestions,
      applied_minimum_thresholds: appliedMinimumThresholds,
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

// Generate suggestions for unmatched ingredients
async function generateIngredientSuggestions(ingredient: string): Promise<string[]> {
  try {
    // Get the first word of the ingredient which might be more generic
    const firstWord = ingredient.split(' ')[0].toLowerCase();
    
    // Query for similar ingredients that have successful mappings
    const { data: mappings } = await supabase
      .from('ingredient_mappings')
      .select('ingredient_text, confidence_score')
      .ilike('ingredient_text', `%${firstWord}%`)
      .gt('confidence_score', 0.7)
      .order('confidence_score', { ascending: false })
      .limit(5);
    
    if (mappings && mappings.length > 0) {
      return mappings.map(m => m.ingredient_text);
    }
    
    return [];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
}

// Estimate fallback nutrition values for unmatched ingredients
function estimateFallbackNutrition(ingredient: string, quantity: number): any {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Basic categorization for fallback values
  let category = 'default';
  
  if (lowerIngredient.includes('oil') || lowerIngredient.includes('butter') || lowerIngredient.includes('fat')) {
    category = 'fat';
  } else if (lowerIngredient.includes('sugar') || lowerIngredient.includes('honey') || lowerIngredient.includes('syrup')) {
    category = 'sugar';
  } else if (lowerIngredient.includes('flour') || lowerIngredient.includes('rice') || lowerIngredient.includes('pasta') || lowerIngredient.includes('bread')) {
    category = 'carb';
  } else if (lowerIngredient.includes('chicken') || lowerIngredient.includes('beef') || lowerIngredient.includes('pork') || lowerIngredient.includes('fish') || lowerIngredient.includes('meat')) {
    category = 'protein';
  } else if (lowerIngredient.includes('vegetable') || lowerIngredient.includes('carrot') || lowerIngredient.includes('broccoli') || lowerIngredient.includes('spinach') || lowerIngredient.includes('lettuce')) {
    category = 'vegetable';
  } else if (lowerIngredient.includes('fruit') || lowerIngredient.includes('apple') || lowerIngredient.includes('orange') || lowerIngredient.includes('banana')) {
    category = 'fruit';
  } else if (lowerIngredient.includes('salt') || lowerIngredient.includes('spice') || lowerIngredient.includes('herb')) {
    category = 'spice';
  } else if (lowerIngredient.includes('milk') || lowerIngredient.includes('cheese') || lowerIngredient.includes('yogurt')) {
    category = 'dairy';
  }
  
  // Estimate values based on category (per 100g)
  const fallbackValues: Record<string, number> = {
    default: { calories: 50, protein_g: 2, carbs_g: 5, fat_g: 2, fiber_g: 1, sugar_g: 1 },
    fat: { calories: 900, protein_g: 0, carbs_g: 0, fat_g: 100, fiber_g: 0, sugar_g: 0 },
    sugar: { calories: 400, protein_g: 0, carbs_g: 100, fat_g: 0, fiber_g: 0, sugar_g: 100 },
    carb: { calories: 350, protein_g: 10, carbs_g: 70, fat_g: 2, fiber_g: 3, sugar_g: 1 },
    protein: { calories: 200, protein_g: 25, carbs_g: 0, fat_g: 10, fiber_g: 0, sugar_g: 0 },
    vegetable: { calories: 35, protein_g: 2, carbs_g: 7, fat_g: 0.5, fiber_g: 3, sugar_g: 3 },
    fruit: { calories: 60, protein_g: 1, carbs_g: 15, fat_g: 0.5, fiber_g: 2, sugar_g: 12 },
    spice: { calories: 5, protein_g: 0.5, carbs_g: 1, fat_g: 0.5, fiber_g: 0.5, sugar_g: 0 },
    dairy: { calories: 120, protein_g: 8, carbs_g: 9, fat_g: 5, fiber_g: 0, sugar_g: 9 }
  };
  
  // Scale values by quantity (assuming quantity is in grams or a reasonable unit)
  // Use a conservative scaling factor to avoid overestimation
  const scalingFactor = Math.min(quantity, 10) * 0.3;
  
  const values = fallbackValues[category];
  
  return {
    calories: values.calories * scalingFactor,
    protein_g: values.protein_g * scalingFactor,
    carbs_g: values.carbs_g * scalingFactor,
    fat_g: values.fat_g * scalingFactor,
    fiber_g: values.fiber_g * scalingFactor,
    sugar_g: values.sugar_g * scalingFactor,
    sodium_mg: 50 * scalingFactor,
    vitamin_a_iu: 50 * scalingFactor,
    vitamin_c_mg: 5 * scalingFactor,
    vitamin_d_iu: 10 * scalingFactor,
    calcium_mg: 30 * scalingFactor,
    iron_mg: 0.5 * scalingFactor,
    potassium_mg: 100 * scalingFactor
  };
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
      JSON.stringify({ 
        error: error.message,
        status: 'error',
        timestamp: new Date().toISOString()
      }),
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

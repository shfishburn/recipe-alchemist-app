
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "../_shared/cors.ts";

// Define the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Type definitions
interface NutrientValue {
  nutrient: string;
  value: number;
  unit: string;
  confidence_score: number;
}

interface FuseNutritionRequest {
  ingredient_text: string;
  alt_source_values?: NutrientValue[];
  cooking_method?: string;
  override_existing?: boolean;
}

interface CanonicalIngredient {
  id: string;
  name: string;
  similarity_score: number;
}

interface FusedNutrient {
  nutrient: string;
  fusedValue: number;
  unit: string;
  confidence: number;
  sources: string[];
}

interface FuseNutritionResponse {
  canonical_ingredient?: CanonicalIngredient;
  fused: FusedNutrient[];
  overall_confidence: number;
  source_count: number;
  metadata?: Record<string, any>;
}

// Bayesian fusion function to combine values from multiple sources
function bayesianFuse(
  values: number[],
  weights: number[],
  defaultWeight = 0.5
): { value: number; confidence: number } {
  if (!values.length) return { value: 0, confidence: 0 };
  
  const validWeights = weights.length === values.length 
    ? weights 
    : values.map((_, i) => weights[i] || defaultWeight);
  
  const totalWeight = validWeights.reduce((a, b) => a + b, 0);
  const fusedValue = values.reduce((sum, val, i) => sum + val * validWeights[i], 0) / totalWeight;
  
  // Calculate confidence based on weighted average + source count boost
  const sourceCountBoost = Math.min(0.2, values.length * 0.05);
  const weightedConfidence = validWeights.reduce((sum, weight) => sum + weight, 0) / validWeights.length;
  const confidence = Math.min(0.95, weightedConfidence + sourceCountBoost);
  
  return { value: fusedValue, confidence };
}

// Main function to fuse nutrition data
async function fuseNutrition(request: FuseNutritionRequest): Promise<FuseNutritionResponse> {
  const { ingredient_text, alt_source_values = [], cooking_method } = request;
  
  try {
    // 1. Find matching ingredients in our database
    const { data: matchedIngredients, error: matchError } = await supabase
      .from('ingredient_nutrition_values')
      .select('id, ingredient_text, normalized_name, nutrition, source_id, confidence_score')
      .or(`ingredient_text.ilike.%${ingredient_text}%, normalized_name.ilike.%${ingredient_text}%`)
      .order('confidence_score', { ascending: false })
      .limit(5);
    
    if (matchError) throw matchError;
    
    // 2. Get source information for confidence weighting
    const { data: sources, error: sourcesError } = await supabase
      .from('nutrition_sources')
      .select('id, source_name, confidence_factor, priority')
      .order('priority', { ascending: false });
    
    if (sourcesError) throw sourcesError;
    
    // Create a source mapping for easier lookup
    const sourcesMap = new Map(sources.map(s => [s.id, s]));
    
    // 3. Prepare data for fusion
    // Create a map to store all nutrient values by nutrient name
    const nutrientValuesMap: Record<string, Array<{value: number; weight: number; source: string}>> = {};
    
    // Add values from database matches
    if (matchedIngredients?.length) {
      for (const match of matchedIngredients) {
        const sourceInfo = sourcesMap.get(match.source_id);
        if (!sourceInfo) continue;
        
        const sourceWeight = sourceInfo.confidence_factor * match.confidence_score;
        const nutrition = match.nutrition;
        
        // Add each nutrient to the map
        for (const [nutrient, value] of Object.entries(nutrition)) {
          if (typeof value === 'number') {
            if (!nutrientValuesMap[nutrient]) {
              nutrientValuesMap[nutrient] = [];
            }
            nutrientValuesMap[nutrient].push({
              value,
              weight: sourceWeight,
              source: sourceInfo.source_name
            });
          }
        }
      }
    }
    
    // Add alternative source values if provided
    if (alt_source_values.length) {
      for (const altValue of alt_source_values) {
        if (!nutrientValuesMap[altValue.nutrient]) {
          nutrientValuesMap[altValue.nutrient] = [];
        }
        nutrientValuesMap[altValue.nutrient].push({
          value: altValue.value,
          weight: altValue.confidence_score || 0.5,
          source: 'alternative_source'
        });
      }
    }
    
    // 4. Apply Bayesian fusion to each nutrient
    const fusedNutrients: FusedNutrient[] = [];
    let totalConfidence = 0;
    
    for (const [nutrient, values] of Object.entries(nutrientValuesMap)) {
      // Skip if no values to fuse
      if (!values.length) continue;
      
      // Extract just the numeric values and weights
      const numericValues = values.map(v => v.value);
      const weights = values.map(v => v.weight);
      
      // Perform fusion
      const { value: fusedValue, confidence } = bayesianFuse(numericValues, weights);
      
      // Determine unit from the most common one (by default use 'g')
      let unit = 'g';
      if (nutrient === 'calories') unit = 'kcal';
      if (nutrient === 'sodium' || nutrient === 'potassium') unit = 'mg';
      
      // Add to results
      fusedNutrients.push({
        nutrient,
        fusedValue,
        unit,
        confidence,
        sources: [...new Set(values.map(v => v.source))]
      });
      
      totalConfidence += confidence;
    }
    
    // Calculate overall confidence
    const overallConfidence = fusedNutrients.length > 0
      ? totalConfidence / fusedNutrients.length
      : 0;
    
    // 5. Store the fused results in database
    if (fusedNutrients.length > 0) {
      // Convert fused nutrients to a JSON object for storage
      const nutritionObject: Record<string, number> = {};
      const confidenceObject: Record<string, number> = {};
      const sourcesObject: Record<string, string[]> = {};
      
      fusedNutrients.forEach(n => {
        nutritionObject[n.nutrient] = n.fusedValue;
        confidenceObject[n.nutrient] = n.confidence;
        sourcesObject[n.nutrient] = n.sources;
      });
      
      // Add overall confidence
      confidenceObject['overall'] = overallConfidence;
      sourcesObject['count'] = Object.keys(sourcesObject).length.toString();
      
      // Look for existing entry
      const { data: existingEntry, error: lookupError } = await supabase
        .from('ingredient_nutrition_fused')
        .select('id')
        .eq('ingredient_text', ingredient_text)
        .maybeSingle();
      
      if (lookupError) {
        console.error('Error checking for existing entry:', lookupError);
      }
      
      // Create or update fused nutrition data
      if (existingEntry?.id && !request.override_existing) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('ingredient_nutrition_fused')
          .update({
            nutrition: nutritionObject,
            confidence: confidenceObject,
            sources: sourcesObject,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEntry.id);
        
        if (updateError) {
          console.error('Error updating fused nutrition:', updateError);
        }
      } else {
        // Create new entry
        const { error: insertError } = await supabase
          .from('ingredient_nutrition_fused')
          .insert({
            ingredient_text,
            normalized_name: ingredient_text.toLowerCase(),
            nutrition: nutritionObject,
            confidence: confidenceObject,
            sources: sourcesObject,
            fusion_method: 'bayesian'
          });
        
        if (insertError) {
          console.error('Error inserting fused nutrition:', insertError);
        }
      }
    }
    
    // 6. Capture cooking method if provided
    if (cooking_method) {
      const { error: cookingMethodError } = await supabase
        .from('cooking_method_classifications')
        .insert({
          instruction_text: cooking_method,
          normalized_method: getNormalizedCookingMethod(cooking_method),
          confidence_score: 0.8,
          classified_by: 'api'
        });
      
      if (cookingMethodError) {
        console.error('Error storing cooking method:', cookingMethodError);
      }
    }
    
    // 7. Return the fused results
    return {
      canonical_ingredient: matchedIngredients?.[0] ? {
        id: matchedIngredients[0].id,
        name: matchedIngredients[0].normalized_name || matchedIngredients[0].ingredient_text,
        similarity_score: matchedIngredients[0].confidence_score
      } : undefined,
      fused: fusedNutrients,
      overall_confidence: overallConfidence,
      source_count: new Set(fusedNutrients.flatMap(n => n.sources)).size,
      metadata: {
        cooking_method: cooking_method ? getNormalizedCookingMethod(cooking_method) : undefined,
        matched_ingredients_count: matchedIngredients?.length || 0
      }
    };
  } catch (error) {
    console.error('Error in fuseNutrition:', error);
    throw error;
  }
}

// Helper function to normalize cooking method
function getNormalizedCookingMethod(method: string): string {
  const methodLower = method.toLowerCase();
  
  if (methodLower.includes('bake') || methodLower.includes('oven')) return 'bake';
  if (methodLower.includes('boil')) return 'boil';
  if (methodLower.includes('braise')) return 'braise';
  if (methodLower.includes('fry') || methodLower.includes('sauté') || methodLower.includes('saute')) return 'fry';
  if (methodLower.includes('grill')) return 'grill';
  if (methodLower.includes('roast')) return 'roast';
  if (methodLower.includes('steam')) return 'steam';
  if (methodLower.includes('slow cook') || methodLower.includes('slow-cook') || methodLower.includes('crock pot')) return 'slow cook';
  if (methodLower.includes('raw') || methodLower.includes('uncooked')) return 'raw';
  
  // Default to the most common method if no match
  return 'bake';
}

// Main server function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData: FuseNutritionRequest = await req.json();
    
    // Validate request
    if (!requestData.ingredient_text) {
      return new Response(
        JSON.stringify({ error: 'ingredient_text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process the fusion request
    const result = await fuseNutrition(requestData);
    
    // Return the result
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Define the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get the USDA Food Data Central API key
const USDA_API_KEY = Deno.env.get('USDA_API_KEY') || '';
const USDA_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Define interfaces
interface SearchRequest {
  query: string;
  dataType?: string[];
  pageSize?: number;
  pageNumber?: number;
}

interface NutrientRequest {
  fdcId: string;
}

// Main search function to find foods by name
async function searchFoods(searchParams: SearchRequest) {
  try {
    const queryString = new URLSearchParams({
      api_key: USDA_API_KEY,
      query: searchParams.query,
      pageSize: (searchParams.pageSize || 25).toString(),
      pageNumber: (searchParams.pageNumber || 1).toString(),
      dataType: searchParams.dataType?.join(',') || 'Foundation,SR Legacy'
    }).toString();
    
    const response = await fetch(`${USDA_API_BASE_URL}/foods/search?${queryString}`);
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching foods:', error);
    throw error;
  }
}

// Function to get detailed nutrient information for a specific food
async function getFoodDetails(fdcId: string) {
  try {
    const queryString = new URLSearchParams({
      api_key: USDA_API_KEY,
    }).toString();
    
    const response = await fetch(`${USDA_API_BASE_URL}/food/${fdcId}?${queryString}`);
    
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting food details:', error);
    throw error;
  }
}

// Function to store USDA data in our database
async function storeUsdaData(foodData: any, sourceId: number = 1) {
  try {
    // Extract basic food information
    const foodCode = foodData.fdcId.toString();
    const foodName = foodData.description || foodData.foodDescription || '';
    
    // Prepare nutrition data object
    const nutrition: Record<string, number> = {};
    
    // Extract nutrients from the food data
    if (foodData.foodNutrients && Array.isArray(foodData.foodNutrients)) {
      for (const nutrient of foodData.foodNutrients) {
        const name = nutrient.nutrientName?.toLowerCase();
        const value = nutrient.value;
        
        if (name && typeof value === 'number') {
          // Map common nutrient names to our standardized keys
          if (name.includes('energy') && (name.includes('kcal') || nutrient.unitName === 'kcal')) {
            nutrition['calories'] = value;
          } else if (name.includes('protein')) {
            nutrition['protein'] = value;
          } else if (name.includes('carbohydrate')) {
            nutrition['carbs'] = value;
          } else if (name.includes('total lipid') || name === 'fat') {
            nutrition['fat'] = value;
          } else if (name.includes('fiber')) {
            nutrition['fiber'] = value;
          } else if (name.includes('sugar')) {
            nutrition['sugar'] = value;
          } else if (name.includes('sodium')) {
            nutrition['sodium'] = value;
          } else if (name.includes('calcium')) {
            nutrition['calcium'] = value;
          } else if (name.includes('iron')) {
            nutrition['iron'] = value;
          } else if (name.includes('potassium')) {
            nutrition['potassium'] = value;
          } else if (name.includes('saturated') && name.includes('fat')) {
            nutrition['saturated_fat'] = value;
          } else if (name.includes('vitamin a')) {
            nutrition['vitaminA'] = value;
          } else if (name.includes('vitamin c')) {
            nutrition['vitaminC'] = value;
          } else if (name.includes('vitamin d')) {
            nutrition['vitaminD'] = value;
          } else if (name.includes('cholesterol')) {
            nutrition['cholesterol'] = value;
          }
        }
      }
    }
    
    // Store in our USDA foods table
    const { error: usdaError } = await supabase
      .from('usda_foods')
      .upsert({
        food_code: foodCode,
        food_name: foodName,
        calories: nutrition.calories,
        protein_g: nutrition.protein,
        carbs_g: nutrition.carbs,
        fat_g: nutrition.fat,
        fiber_g: nutrition.fiber,
        sugar_g: nutrition.sugar,
        sodium_mg: nutrition.sodium,
        calcium_mg: nutrition.calcium,
        iron_mg: nutrition.iron,
        potassium_mg: nutrition.potassium,
        vitamin_a_iu: nutrition.vitaminA,
        vitamin_c_mg: nutrition.vitaminC,
        vitamin_d_iu: nutrition.vitaminD,
        cholesterol_mg: nutrition.cholesterol,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'food_code'
      });
      
    if (usdaError) {
      throw usdaError;
    }
    
    // Store in our ingredient_nutrition_values table for use with fusion
    const { error: nutritionError } = await supabase
      .from('ingredient_nutrition_values')
      .insert({
        ingredient_text: foodName,
        normalized_name: foodName.toLowerCase(),
        source_id: sourceId,
        usda_food_code: foodCode,
        nutrition,
        confidence_score: 0.9,
        metadata: {
          original_data_type: foodData.dataType || 'unknown',
          fdc_id: foodData.fdcId,
          publication_date: foodData.publicationDate
        }
      });
    
    if (nutritionError) {
      console.error('Error storing in ingredient_nutrition_values:', nutritionError);
    }
    
    return { food_code: foodCode, food_name: foodName };
  } catch (error) {
    console.error('Error storing USDA data:', error);
    throw error;
  }
}

// The main server function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Check if API key is set
  if (!USDA_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'USDA API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    // Route handling
    if (path === 'search') {
      const params: SearchRequest = await req.json();
      const results = await searchFoods(params);
      return new Response(
        JSON.stringify(results),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else if (path === 'get-food') {
      const params: NutrientRequest = await req.json();
      const results = await getFoodDetails(params.fdcId);
      return new Response(
        JSON.stringify(results),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else if (path === 'import-food') {
      const { fdcId } = await req.json();
      // Get food details
      const foodData = await getFoodDetails(fdcId);
      // Store in database
      const results = await storeUsdaData(foodData);
      return new Response(
        JSON.stringify(results),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid endpoint' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

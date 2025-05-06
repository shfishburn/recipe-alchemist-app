
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Initialize environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const FDC_API_KEY = Deno.env.get("FDC_API_KEY") || "";
const FDC_API_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// Define CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface NutritionVerificationRequest {
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  existingNutrition?: Record<string, any>;
  recipeId?: string;
}

interface VerificationResult {
  verified: boolean;
  updatedNutrition: Record<string, any>;
  verificationDetails: {
    verified_at: string;
    verified_nutrients: string[];
    verification_source: 'fdc_api' | 'usda_sr28';
    verification_confidence: number;
    differences?: Record<string, {old: number; new: number; difference_percent: number}>;
  };
  debug_info?: Record<string, any>;
}

// FoodData Central nutrient ID mapping to our nutrition model
const NUTRIENT_ID_MAP = {
  calories: 1008, // Energy (kcal)
  protein: 1003, // Protein
  carbs: 1005, // Carbohydrates, total
  fat: 1004, // Total lipid (fat)
  saturated_fat: 1258, // Fatty acids, total saturated
  sugar: 2000, // Sugars, total including NLEA
  fiber: 1079, // Fiber, total dietary
  sodium: 1093, // Sodium, Na
  calcium: 1087, // Calcium, Ca
  iron: 1089, // Iron, Fe
  potassium: 1092, // Potassium, K
  vitaminA: 1104, // Vitamin A, RAE
  vitaminC: 1162, // Vitamin C, total ascorbic acid
  vitaminD: 1114, // Vitamin D (D2 + D3)
};

// Helper function to search FDC API
async function searchFoodBySoundex(query: string): Promise<any> {
  try {
    const url = `${FDC_API_BASE_URL}/foods/search?api_key=${FDC_API_KEY}&query=${encodeURIComponent(query)}&dataType=Foundation,SR Legacy&pageSize=5`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.foods && data.foods.length > 0 ? data.foods[0] : null;
  } catch (error) {
    console.error("Error searching FDC API:", error);
    return null;
  }
}

// Get detailed food information including nutrients
async function getFoodDetails(fdcId: string): Promise<any> {
  try {
    const url = `${FDC_API_BASE_URL}/food/${fdcId}?api_key=${FDC_API_KEY}&nutrients=${Object.values(NUTRIENT_ID_MAP).join(",")}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching food details:", error);
    return null;
  }
}

// Extract nutrient values from FDC API response
function extractNutrients(foodDetails: any): Record<string, number> {
  const nutrients: Record<string, number> = {};
  
  if (!foodDetails || !foodDetails.foodNutrients) {
    return nutrients;
  }
  
  // Map FDC nutrient IDs to our nutrient names
  for (const [ourKey, fdcId] of Object.entries(NUTRIENT_ID_MAP)) {
    const nutrient = foodDetails.foodNutrients.find((n: any) => n.nutrient?.id === fdcId);
    if (nutrient) {
      nutrients[ourKey] = nutrient.amount || 0;
    }
  }
  
  return nutrients;
}

// Calculate percentage difference between two values
function calculateDifference(oldValue: number, newValue: number): number {
  if (oldValue === 0 || newValue === 0) {
    return oldValue === newValue ? 0 : 100;
  }
  return Math.abs((newValue - oldValue) / oldValue * 100);
}

// Verify nutrition data for a single ingredient
async function verifyIngredient(ingredient: { name: string; quantity: number; unit: string }): Promise<any> {
  try {
    // Find matching food in FDC API
    const searchResult = await searchFoodBySoundex(ingredient.name);
    if (!searchResult) {
      return null;
    }
    
    // Get detailed nutrition data
    const foodDetails = await getFoodDetails(searchResult.fdcId);
    if (!foodDetails) {
      return null;
    }
    
    // Extract and return nutrient values
    const nutrients = extractNutrients(foodDetails);
    
    // Apply scaling based on quantity
    // This is a simplified approach - in reality you'd need proper conversion logic
    const approximateWeight = ingredient.quantity * 100; // Simple estimation
    const scaleFactor = approximateWeight / 100; // FDC values are per 100g
    
    Object.keys(nutrients).forEach(key => {
      nutrients[key] *= scaleFactor;
    });
    
    return {
      fdcId: searchResult.fdcId,
      description: searchResult.description,
      nutrients: nutrients,
      confidence: 0.8, // Default confidence score
    };
  } catch (error) {
    console.error("Error verifying ingredient:", error);
    return null;
  }
}

// Compare and merge nutrition data
function mergeNutritionData(
  existingNutrition: Record<string, any>,
  verifiedData: Array<{ nutrients: Record<string, number> }>
): VerificationResult {
  // Start with a copy of existing nutrition
  const mergedNutrition = { ...existingNutrition };
  
  // Sum up all verified nutrients
  const verifiedNutrients: Record<string, number> = {};
  verifiedData.forEach(item => {
    Object.entries(item.nutrients).forEach(([key, value]) => {
      verifiedNutrients[key] = (verifiedNutrients[key] || 0) + value;
    });
  });
  
  // Track differences between existing and verified values
  const differences: Record<string, {old: number; new: number; difference_percent: number}> = {};
  const verifiedNutrientsList: string[] = [];
  
  // Compare and update values where significant differences exist
  Object.entries(verifiedNutrients).forEach(([key, newValue]) => {
    // Get existing value, accounting for different field naming conventions
    const oldValue = mergedNutrition[key] || 
                    mergedNutrition[`${key}_g`] || 
                    mergedNutrition[`${key}_mg`] || 
                    0;
    
    const diffPercent = calculateDifference(oldValue, newValue);
    
    // If difference is significant, use verified value
    if (diffPercent > 15) {
      differences[key] = {
        old: oldValue,
        new: newValue,
        difference_percent: diffPercent
      };
      
      // Update nutrition with verified value
      mergedNutrition[key] = newValue;
      verifiedNutrientsList.push(key);
    }
  });
  
  // Always add saturated fat if available, since it's critical
  if (verifiedNutrients.saturated_fat !== undefined && 
      mergedNutrition.saturated_fat === undefined) {
    mergedNutrition.saturated_fat = verifiedNutrients.saturated_fat;
    verifiedNutrientsList.push('saturated_fat');
  }
  
  // Add verification metadata
  const verificationDetails = {
    verified_at: new Date().toISOString(),
    verified_nutrients: verifiedNutrientsList,
    verification_source: 'fdc_api' as const,
    verification_confidence: 0.85, // Default confidence unless modified
    differences: Object.keys(differences).length > 0 ? differences : undefined
  };
  
  mergedNutrition.verification = verificationDetails;
  
  return {
    verified: verifiedNutrientsList.length > 0,
    updatedNutrition: mergedNutrition,
    verificationDetails
  };
}

// Main handler for the edge function
async function verifyNutritionData(req: NutritionVerificationRequest): Promise<VerificationResult> {
  try {
    console.log("Verifying nutrition data for ingredients:", req.ingredients.map(i => i.name).join(", "));
    
    // Skip verification if no ingredients or nutrition data provided
    if (!req.ingredients || req.ingredients.length === 0 || !req.existingNutrition) {
      return {
        verified: false,
        updatedNutrition: req.existingNutrition || {},
        verificationDetails: {
          verified_at: new Date().toISOString(),
          verified_nutrients: [],
          verification_source: 'fdc_api',
          verification_confidence: 0
        }
      };
    }
    
    // Process each ingredient
    const verifiedIngredients = await Promise.all(
      req.ingredients.map(ingredient => verifyIngredient(ingredient))
    );
    
    // Filter out null results
    const validResults = verifiedIngredients.filter(Boolean);
    
    // If we didn't get any valid results, return original data
    if (validResults.length === 0) {
      return {
        verified: false,
        updatedNutrition: req.existingNutrition,
        verificationDetails: {
          verified_at: new Date().toISOString(),
          verified_nutrients: [],
          verification_source: 'fdc_api',
          verification_confidence: 0
        }
      };
    }
    
    // Merge verified data with existing nutrition
    const result = mergeNutritionData(req.existingNutrition, validResults);
    
    // If recipeId is provided, store the verified nutrition in the database
    if (req.recipeId && result.verified) {
      try {
        await supabase
          .from('recipes')
          .update({ nutrition: result.updatedNutrition })
          .eq('id', req.recipeId);
          
        console.log(`Updated nutrition data for recipe ${req.recipeId}`);
      } catch (dbError) {
        console.error("Error updating recipe nutrition in database:", dbError);
        // Continue even if database update fails
      }
    }
    
    return {
      ...result,
      debug_info: {
        ingredients_processed: req.ingredients.length,
        valid_results: validResults.length,
        verification_time: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Error in verify-nutrition-data:", error);
    return {
      verified: false,
      updatedNutrition: req.existingNutrition || {},
      verificationDetails: {
        verified_at: new Date().toISOString(),
        verified_nutrients: [],
        verification_source: 'fdc_api',
        verification_confidence: 0
      },
      debug_info: {
        error: error.message
      }
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: NutritionVerificationRequest = await req.json();
    
    // Log request data
    console.log("Received nutrition verification request");
    
    // Process the request
    const result = await verifyNutritionData(requestData);
    
    // Return result
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 400
      }
    );
  }
});

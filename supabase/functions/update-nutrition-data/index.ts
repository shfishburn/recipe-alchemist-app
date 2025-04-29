
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Standardize nutrition field names to ensure consistency
const NUTRITION_FIELD_NAMES = {
  calories: ['calories', 'kcal'],
  protein: ['protein_g', 'protein'],
  carbs: ['carbs_g', 'carbs'],
  fat: ['fat_g', 'fat'],
  fiber: ['fiber_g', 'fiber'],
  sugar: ['sugar_g', 'sugar'],
  sodium: ['sodium_mg', 'sodium'],
  // Micronutrients
  vitamin_a: ['vitamin_a_iu', 'vitaminA'],
  vitamin_c: ['vitamin_c_mg', 'vitaminC'],
  vitamin_d: ['vitamin_d_iu', 'vitaminD'],
  calcium: ['calcium_mg', 'calcium'],
  iron: ['iron_mg', 'iron'],
  potassium: ['potassium_mg', 'potassium']
};

// Daily reference values for nutrients
const DAILY_REFERENCE_VALUES = {
  calories: 2000,     // kcal
  protein: 50,        // g
  carbs: 275,         // g 
  fat: 78,            // g
  fiber: 28,          // g
  sugar: 50,          // g (added sugars)
  sodium: 2300,       // mg
  vitamin_a: 5000,    // IU
  vitamin_c: 90,      // mg
  vitamin_d: 800,     // IU
  calcium: 1300,      // mg
  iron: 18,           // mg
  potassium: 4700     // mg
};

// Function to standardize nutrition data
function standardizeNutrition(input: any) {
  if (!input || typeof input !== 'object') return {};
  
  const output: any = {};
  
  // Map calories (priority to 'calories' field, fallback to 'kcal')
  if (input.calories !== undefined) {
    output.calories = Number(input.calories);
    output.kcal = Number(input.calories);
  } else if (input.kcal !== undefined) {
    output.calories = Number(input.kcal);
    output.kcal = Number(input.kcal);
  }
  
  // Map macronutrients with proper _g suffix
  if (input.protein !== undefined) {
    output.protein_g = Number(input.protein);
    output.protein = Number(input.protein);
  } else if (input.protein_g !== undefined) {
    output.protein_g = Number(input.protein_g);
    output.protein = Number(input.protein_g);
  }
  
  if (input.carbs !== undefined) {
    output.carbs_g = Number(input.carbs);
    output.carbs = Number(input.carbs);
  } else if (input.carbs_g !== undefined) {
    output.carbs_g = Number(input.carbs_g);
    output.carbs = Number(input.carbs_g);
  }
  
  if (input.fat !== undefined) {
    output.fat_g = Number(input.fat);
    output.fat = Number(input.fat);
  } else if (input.fat_g !== undefined) {
    output.fat_g = Number(input.fat_g);
    output.fat = Number(input.fat_g);
  }
  
  // Handle fiber with proper _g suffix
  if (input.fiber !== undefined) {
    output.fiber_g = Number(input.fiber);
    output.fiber = Number(input.fiber);
  } else if (input.fiber_g !== undefined) {
    output.fiber_g = Number(input.fiber_g);
    output.fiber = Number(input.fiber);
  } else if (input.dietary_fiber !== undefined) {
    // Additional field name that could be used
    output.fiber_g = Number(input.dietary_fiber);
    output.fiber = Number(input.dietary_fiber);
  }
  
  // Handle other nutrition fields with proper suffixes
  if (input.sugar_g !== undefined) output.sugar_g = Number(input.sugar_g);
  if (input.sugar !== undefined && output.sugar_g === undefined) output.sugar_g = Number(input.sugar);
  
  if (input.sodium_mg !== undefined) output.sodium_mg = Number(input.sodium_mg);
  if (input.sodium !== undefined && output.sodium_mg === undefined) output.sodium_mg = Number(input.sodium);
  
  // Map micronutrients
  if (input.vitamin_a_iu !== undefined) output.vitamin_a_iu = Number(input.vitamin_a_iu);
  if (input.vitaminA !== undefined && output.vitamin_a_iu === undefined) output.vitamin_a_iu = Number(input.vitaminA);
  if (input.vitamin_a !== undefined && output.vitamin_a_iu === undefined) output.vitamin_a_iu = Number(input.vitamin_a);
  
  if (input.vitamin_c_mg !== undefined) output.vitamin_c_mg = Number(input.vitamin_c_mg);
  if (input.vitaminC !== undefined && output.vitamin_c_mg === undefined) output.vitamin_c_mg = Number(input.vitaminC);
  if (input.vitamin_c !== undefined && output.vitamin_c_mg === undefined) output.vitamin_c_mg = Number(input.vitamin_c);
  
  if (input.vitamin_d_iu !== undefined) output.vitamin_d_iu = Number(input.vitamin_d_iu);
  if (input.vitaminD !== undefined && output.vitamin_d_iu === undefined) output.vitamin_d_iu = Number(input.vitaminD);
  if (input.vitamin_d !== undefined && output.vitamin_d_iu === undefined) output.vitamin_d_iu = Number(input.vitamin_d);
  
  if (input.calcium_mg !== undefined) output.calcium_mg = Number(input.calcium_mg);
  if (input.calcium !== undefined && output.calcium_mg === undefined) output.calcium_mg = Number(input.calcium);
  
  if (input.iron_mg !== undefined) output.iron_mg = Number(input.iron_mg);
  if (input.iron !== undefined && output.iron_mg === undefined) output.iron_mg = Number(input.iron);
  
  if (input.potassium_mg !== undefined) output.potassium_mg = Number(input.potassium_mg);
  if (input.potassium !== undefined && output.potassium_mg === undefined) output.potassium_mg = Number(input.potassium);
  
  return output;
}

// Validate if nutrition data has at least basic information
function validateNutrition(nutrition: any): boolean {
  if (!nutrition || typeof nutrition !== 'object') return false;
  
  // Check if at least one valid nutrition field exists
  const hasCalories = nutrition.calories !== undefined || nutrition.kcal !== undefined;
  const hasProtein = nutrition.protein_g !== undefined || nutrition.protein !== undefined;
  const hasCarbs = nutrition.carbs_g !== undefined || nutrition.carbs !== undefined;
  const hasFat = nutrition.fat_g !== undefined || nutrition.fat !== undefined;
  
  // Basic validation: must have at least calories and one macronutrient
  return hasCalories && (hasProtein || hasCarbs || hasFat);
}

// Process a batch of recipes
async function processRecipeBatch(recipes: any[]) {
  console.log(`Processing batch of ${recipes.length} recipes`);
  let updatedCount = 0;
  let errorCount = 0;

  for (const recipe of recipes) {
    try {
      // Skip if no nutrition data at all
      if (!recipe.nutrition) {
        console.log(`Recipe ${recipe.id} has no nutrition data, skipping`);
        continue;
      }

      // Parse nutrition if it's a string
      let nutritionData;
      if (typeof recipe.nutrition === 'string') {
        try {
          nutritionData = JSON.parse(recipe.nutrition);
        } catch (e) {
          console.error(`Error parsing nutrition JSON for recipe ${recipe.id}:`, e);
          continue;
        }
      } else {
        nutritionData = recipe.nutrition;
      }

      // Standardize the nutrition data
      const standardizedNutrition = standardizeNutrition(nutritionData);
      
      // Only update if validation passes
      if (validateNutrition(standardizedNutrition)) {
        // Update the recipe with improved nutrition data
        const { error } = await supabase
          .from('recipes')
          .update({ nutrition: standardizedNutrition })
          .eq('id', recipe.id);
        
        if (error) {
          console.error(`Error updating recipe ${recipe.id}:`, error);
          errorCount++;
        } else {
          updatedCount++;
        }
      } else {
        console.log(`Recipe ${recipe.id} nutrition data failed validation`);
      }
    } catch (error) {
      console.error(`Error processing recipe ${recipe.id}:`, error);
      errorCount++;
    }
  }
  
  return { updatedCount, errorCount };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    console.log('Starting nutrition data update process');
    
    // Get batch size from request or use default
    const url = new URL(req.url);
    const batchSize = parseInt(url.searchParams.get('batchSize') || '50');
    const dryRun = url.searchParams.get('dryRun') === 'true';
    
    // Only allow authorized requests 
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch all recipes from the database
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, nutrition')
      .order('created_at', { ascending: false })
      .is('deleted_at', null);
    
    if (error) {
      throw new Error(`Error fetching recipes: ${error.message}`);
    }
    
    console.log(`Found ${recipes.length} recipes to process`);
    
    // Process the recipes in batches
    let totalUpdated = 0;
    let totalErrors = 0;
    
    if (!dryRun) {
      // Process in batches to avoid timeouts
      for (let i = 0; i < recipes.length; i += batchSize) {
        const batch = recipes.slice(i, i + batchSize);
        const { updatedCount, errorCount } = await processRecipeBatch(batch);
        totalUpdated += updatedCount;
        totalErrors += errorCount;
      }
    }
    
    // Return a summary of the update operation
    return new Response(
      JSON.stringify({
        status: 'success',
        totalRecipes: recipes.length,
        updatedRecipes: totalUpdated,
        errorCount: totalErrors,
        dryRun: dryRun
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in update-nutrition-data function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./constants.ts";
import { processRecipeBatch } from "./batch-processor.ts";
import { createSupabaseAdmin } from "./utils.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    console.log('Starting recipe data update process');
    
    // Parse request body
    let params;
    try {
      params = await req.json();
    } catch (e) {
      params = {};
    }
    
    // Get parameters from request or use defaults
    const batchSize = params.batchSize || 50;
    const dryRun = params.dryRun === true;
    const updateType = params.updateType || 'nutrition'; // 'nutrition' or 'science'
    
    // Only allow authorized requests 
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Initialize Supabase client
    const supabase = createSupabaseAdmin();
    
    // Fetch all recipes from the database
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, nutrition, science_notes')
      .order('created_at', { ascending: false })
      .is('deleted_at', null);
    
    if (error) {
      throw new Error(`Error fetching recipes: ${error.message}`);
    }
    
    console.log(`Found ${recipes.length} recipes to process for ${updateType} updates`);
    
    // Process the recipes in batches
    let totalUpdated = 0;
    let totalErrors = 0;
    
    if (!dryRun) {
      // Process in batches to avoid timeouts
      for (let i = 0; i < recipes.length; i += batchSize) {
        const batch = recipes.slice(i, i + batchSize);
        const { updatedCount, errorCount } = await processRecipeBatch(batch, supabase, { updateType });
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
        dryRun: dryRun,
        updateType: updateType
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in update function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

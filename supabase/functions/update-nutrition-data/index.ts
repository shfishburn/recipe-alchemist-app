
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders } from './constants.ts';
import { processRecipeBatch } from './batch-processor.ts';

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        const { updatedCount, errorCount } = await processRecipeBatch(batch, supabase);
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
});

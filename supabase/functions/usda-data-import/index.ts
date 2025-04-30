
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { parse } from "https://deno.land/std@0.177.0/encoding/csv.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  validateData, 
  normalizeUsdaFoodData,
  normalizeUnitConversionData,
  normalizeYieldFactorData,
  isSR28Format
} from "./data-processors.ts";
import { insertBatch, TableType } from "./database.ts";

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse the request as JSON
    const { table, csvData, batchSize = 100, mode = 'insert' } = await req.json();
    
    if (!csvData || !table) {
      throw new Error('Missing required parameters: csvData and table');
    }
    
    // Parse CSV data
    const options = { skipFirstRow: true, columns: true };
    const parsedData = await parse(csvData, options);
    
    console.log(`Parsed ${parsedData.length} rows from CSV for table ${table}`);

    // Validate table type
    if (!Object.values(TableType).includes(table as TableType)) {
      throw new Error(`Invalid table type: ${table}. Must be one of: ${Object.values(TableType).join(', ')}`);
    }

    // Check if data is in SR28 format
    const headers = csvData.split('\n')[0].split(',').map(h => h.trim().replace(/^"(.+)"$/, '$1'));
    const isSR28Dataset = isSR28Format(headers);
    console.log(`Data format detected: ${isSR28Dataset ? 'USDA SR28' : 'Standard'}`);
    
    // Validate data based on table type
    const validationResult = validateData(parsedData, table as TableType, isSR28Dataset);
    
    if (!validationResult.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Data validation failed',
          details: validationResult.errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Normalize data based on the table type
    let normalizedData;
    switch (table) {
      case TableType.USDA_FOODS:
        normalizedData = parsedData.map(row => normalizeUsdaFoodData(row, isSR28Dataset));
        break;
      case TableType.UNIT_CONVERSIONS:
        normalizedData = parsedData.map(normalizeUnitConversionData);
        break;
      case TableType.YIELD_FACTORS:
        normalizedData = parsedData.map(normalizeYieldFactorData);
        break;
      default:
        throw new Error(`Unsupported table type: ${table}`);
    }

    // Process data in batches
    const results = await insertBatch({
      supabase,
      data: normalizedData,
      table: table as TableType,
      batchSize,
      mode: mode as 'insert' | 'upsert'
    });

    // Return the results
    return new Response(
      JSON.stringify({ 
        success: true,
        processed: normalizedData.length,
        results,
        format: isSR28Dataset ? 'SR28' : 'Standard'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in usda-data-import function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: Deno.env.get('ENVIRONMENT') === 'development' ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

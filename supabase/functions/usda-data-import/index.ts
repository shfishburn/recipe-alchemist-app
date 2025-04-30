import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "../_shared/cors.ts";
import { 
  validateData, 
  normalizeUsdaFoodData,
  normalizeUnitConversionData,
  normalizeYieldFactorData,
  normalizeUsdaRawFoodData,
  normalizeUsdaRawMeasureUnitData,
  normalizeUsdaRawFoodPortionsData,
  normalizeUsdaRawYieldFactorsData,
  isSR28Format,
  isUSDAFormat
} from "./data-processors.ts";
import { insertBatch, TableType } from "./database.ts";

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Custom CSV parser to handle potential format issues
async function safeParseCsv(csvData: string): Promise<{ headers: string[], rows: Record<string, string>[] }> {
  try {
    // Check if CSV is empty
    if (!csvData || csvData.trim() === '') {
      throw new Error('CSV data is empty');
    }
    
    // Split by lines and check if we have at least two lines (header + one data row)
    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }
    
    // Parse the header row
    const headers = parseCSVLine(lines[0]);
    
    if (headers.length === 0) {
      throw new Error('CSV header row is empty or invalid');
    }
    
    // Parse data rows
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = parseCSVLine(lines[i]);
      
      // Validate row length matches headers
      if (values.length !== headers.length) {
        throw new Error(`Row ${i + 1} has ${values.length} columns but header has ${headers.length} columns`);
      }
      
      // Create object mapping header to value
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      rows.push(row);
    }
    
    return { headers, rows };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
}

// Helper to parse a CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentValue.trim().replace(/^"(.+)"$/, '$1'));
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  result.push(currentValue.trim().replace(/^"(.+)"$/, '$1'));
  
  return result;
}

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
    
    // Validate table type
    if (!Object.values(TableType).includes(table as TableType) && 
        !table.startsWith('usda_raw.')) {
      throw new Error(`Invalid table type: ${table}. Must be one of: ${Object.values(TableType).join(', ')} or a usda_raw.* table`);
    }

    console.log(`Received CSV import request for table ${table}, data length: ${csvData.length}`);
    
    // Parse CSV data with our safer parser
    const { headers, rows } = await safeParseCsv(csvData);
    
    console.log(`Parsed ${rows.length} rows from CSV for table ${table}`);
    console.log(`CSV Headers: ${headers.join(', ')}`);

    // Check data format
    const isSR28Dataset = isSR28Format(headers);
    const isUSDADataset = isUSDAFormat(headers);
    
    let formatLabel = 'Standard';
    if (isSR28Dataset) formatLabel = 'SR28';
    if (isUSDADataset) formatLabel = 'USDA';
    
    console.log(`Data format detected: ${formatLabel}`);
    
    // Validate data based on table type
    const validationResult = validateData(rows, table, isSR28Dataset, isUSDADataset);
    
    if (!validationResult.isValid) {
      return new Response(
        JSON.stringify({ 
          success: false,
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
      // Standard tables
      case TableType.USDA_FOODS:
        normalizedData = rows.map(row => normalizeUsdaFoodData(row, isSR28Dataset));
        break;
      case TableType.UNIT_CONVERSIONS:
        normalizedData = rows.map(normalizeUnitConversionData);
        break;
      case TableType.YIELD_FACTORS:
        normalizedData = rows.map(normalizeYieldFactorData);
        break;
      
      // USDA raw tables
      case TableType.RAW_FOOD:
        normalizedData = rows.map(normalizeUsdaRawFoodData);
        break;
      case TableType.RAW_MEASURE_UNIT:
        normalizedData = rows.map(normalizeUsdaRawMeasureUnitData);
        break;
      case TableType.RAW_FOOD_PORTIONS:
        normalizedData = rows.map(normalizeUsdaRawFoodPortionsData);
        break;
      case TableType.RAW_YIELD_FACTORS:
        normalizedData = rows.map(normalizeUsdaRawYieldFactorsData);
        break;
        
      default:
        throw new Error(`Unsupported table type: ${table}`);
    }

    // Process data in batches
    const results = await insertBatch({
      supabase,
      data: normalizedData,
      table,
      batchSize,
      mode: mode as 'insert' | 'upsert'
    });

    // Return the results
    return new Response(
      JSON.stringify({ 
        success: true,
        processed: normalizedData.length,
        results,
        format: formatLabel
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
        success: false,
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

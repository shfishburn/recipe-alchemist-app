
import { supabase } from "@/integrations/supabase/client";

/**
 * Supported table types for CSV imports
 */
export enum UsdaTableType {
  USDA_FOODS = 'usda_foods',
  UNIT_CONVERSIONS = 'usda_unit_conversions',
  YIELD_FACTORS = 'usda_yield_factors',
  // USDA Raw tables
  RAW_FOOD = 'usda_raw.food',
  RAW_MEASURE_UNIT = 'usda_raw.measure_unit',
  RAW_FOOD_PORTIONS = 'usda_raw.food_portions',
  RAW_YIELD_FACTORS = 'usda_raw.yield_factors'
}

/**
 * Import modes
 */
export type ImportMode = 'insert' | 'upsert';

/**
 * Response from the import function
 */
export interface ImportResponse {
  success: boolean;
  processed?: number;
  results?: {
    totalRecords: number;
    successCount: number;
    errorCount: number;
    errors: { index: number; error: string }[];
    batchResults: { batch: number; count: number }[];
  };
  format?: 'SR28' | 'Standard' | 'USDA';
  error?: string;
  details?: string[];
}

/**
 * Import CSV data into a specified USDA table
 */
export async function importUsdaData(
  csvData: string,
  table: UsdaTableType,
  options?: {
    batchSize?: number;
    mode?: ImportMode;
  }
): Promise<ImportResponse> {
  try {
    // Basic validation before sending to server
    if (!csvData || csvData.trim() === '') {
      return { success: false, error: 'CSV data is empty' };
    }

    console.log(`Invoking USDA import function with ${csvData.length} bytes of data for table ${table}`);
    
    const { data, error } = await supabase.functions.invoke('usda-data-import', {
      body: {
        csvData,
        table,
        batchSize: options?.batchSize || 100,
        mode: options?.mode || 'insert'
      }
    });

    if (error) {
      console.error('Error invoking USDA data import function:', error);
      
      let errorMessage = error.message || 'Unknown error';
      let errorDetails: string[] = [];
      
      // Try to parse the error message if it's JSON
      try {
        if (typeof error.message === 'string' && error.message.includes('{')) {
          const errorJson = JSON.parse(error.message.substring(error.message.indexOf('{')));
          errorMessage = errorJson.error || errorMessage;
          errorDetails = errorJson.details || [];
        }
      } catch (parseError) {
        console.error('Could not parse error message as JSON:', parseError);
      }
      
      return { 
        success: false, 
        error: `Function error: ${errorMessage}`,
        details: errorDetails
      };
    }

    console.log('USDA import response:', data);
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Unknown error during import',
        details: data.details || [`Error processing ${table} data. Check column formats and constraints.`]
      };
    }

    return data as ImportResponse;
  } catch (err) {
    console.error('Unexpected error during USDA data import:', err);
    return { 
      success: false, 
      error: err instanceof Error 
        ? `Import error: ${err.message}` 
        : 'Unknown error during import. Check the console for details.' 
    };
  }
}

/**
 * Helper function to read a CSV file
 */
export function readCsvFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (file.type && file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      reject(new Error('The selected file does not appear to be a CSV file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Check for basic content validation
        if (reader.result.trim() === '') {
          reject(new Error('The CSV file is empty'));
          return;
        }
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => {
      reject(new Error(`File reading error: ${reader.error?.message || 'Unknown error'}`));
    };
    reader.readAsText(file);
  });
}

// Updated SR28 column mappings to match your specific format
export const sr28Mappings = {
  food_code: 'food_code',
  food_name: 'food_name',
  calories: 'calories',
  protein_g: 'protein_(g)',
  carbs_g: 'carbs_g',
  fat_g: 'fat_g',
  fiber_g: 'fiber_g',
  sugar_g: 'sugar_g',
  sodium_mg: 'sodium_mg',
  cholesterol_mg: 'cholesterol_mg',
  gmwt_1: 'GmWt_1',
  gmwt_desc1: 'GmWt_Desc1',
  gmwt_2: 'GmWt_2',
  gmwt_desc2: 'GmWt_Desc2'
};

/**
 * Function to validate a CSV file before import
 */
export function validateCsvFormat(
  csvData: string,
  requiredColumns: string[]
): { isValid: boolean; missingColumns: string[]; isSR28?: boolean; isUSDA?: boolean } {
  if (!csvData) {
    return { isValid: false, missingColumns: [] };
  }

  // Get the header row
  const headerRow = csvData.split('\n')[0];
  if (!headerRow) {
    return { isValid: false, missingColumns: ['Header row is missing'] };
  }

  // Parse header columns
  const columns = headerRow
    .split(',')
    .map(col => col.trim().replace(/^"(.+)"$/, '$1'));
  
  // Check if this is USDA format (Food.csv, MeasureUnit.csv, etc.)
  const usdaColumns = ['fdc_id', 'publication_date', 'id', 'gram_weight'];
  const isUSDA = usdaColumns.some(col => columns.includes(col));
  
  // Check if this is SR28 format - updated to match your format
  const sr28Columns = ['food_code', 'food_name', 'calories', 'protein_(g)', 'fat_g'];
  const isSR28 = sr28Columns.some(col => columns.includes(col)) &&
                 columns.includes('food_code');
  
  if (isUSDA) {
    // For USDA format, we have specific requirements based on the file type
    // We'll check for key columns that should be present in each file type
    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    
    return {
      isValid: missingColumns.length === 0,
      missingColumns,
      isUSDA: true
    };
  }
  
  if (isSR28) {
    // For SR28 format, we use the direct mappings since column names already match
    const missingColumns = requiredColumns.filter(col => {
      const sr28Column = sr28Mappings[col as keyof typeof sr28Mappings];
      return sr28Column ? !columns.includes(sr28Column) : !columns.includes(col);
    });
    
    return {
      isValid: missingColumns.length === 0,
      missingColumns,
      isSR28: true
    };
  }
  
  // Standard format validation
  const missingColumns = requiredColumns.filter(col => 
    !columns.find(c => c.toLowerCase() === col.toLowerCase())
  );

  return {
    isValid: missingColumns.length === 0,
    missingColumns
  };
}

/**
 * Function to detect if CSV is in SR28 format
 */
export function isSR28Format(headers: any): boolean {
  if (!headers) return false;
  
  let columns: string[];
  if (Array.isArray(headers)) {
    columns = headers;
  } else if (typeof headers === 'string') {
    // Get the header row
    const headerRow = headers.split('\n')[0];
    if (!headerRow) return false;
    
    // Parse header columns
    columns = headerRow
      .split(',')
      .map(col => col.trim().replace(/^"(.+)"$/, '$1'));
  } else {
    return false;
  }
  
  // Check for key SR28 columns based on your format
  const sr28Columns = ['food_code', 'food_name', 'calories', 'protein_(g)', 'fat_g'];
  // If it has at least 3 of these columns, it's likely SR28 format
  const matchCount = sr28Columns.filter(col => columns.includes(col)).length;
  
  return matchCount >= 3 && columns.includes('food_code');
}

/**
 * Function to detect if CSV is in USDA format
 */
export function isUSDAFormat(headers: any): boolean {
  if (!headers) return false;
  
  let columns: string[];
  if (Array.isArray(headers)) {
    columns = headers;
  } else if (typeof headers === 'string') {
    // Get the header row
    const headerRow = headers.split('\n')[0];
    if (!headerRow) return false;
    
    // Parse header columns
    columns = headerRow
      .split(',')
      .map(col => col.trim().replace(/^"(.+)"$/, '$1'));
  } else {
    return false;
  }
  
  // USDA format indicators
  const usdaColumns = ['fdc_id', 'id', 'publication_date', 'gram_weight', 'measure_unit_id'];
  const matchCount = usdaColumns.filter(col => columns.includes(col)).length;
  
  return matchCount >= 2;
}

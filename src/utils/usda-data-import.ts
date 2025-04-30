
import { supabase } from "@/integrations/supabase/client";

/**
 * Supported table types for CSV imports
 */
export enum UsdaTableType {
  USDA_FOODS = 'usda_foods',
  UNIT_CONVERSIONS = 'usda_unit_conversions',
  YIELD_FACTORS = 'usda_yield_factors'
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
  format?: 'SR28' | 'Standard';
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

/**
 * Function to validate a CSV file before import
 */
export function validateCsvFormat(
  csvData: string,
  requiredColumns: string[]
): { isValid: boolean; missingColumns: string[]; isSR28?: boolean } {
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
  
  // Check if this is SR28 format
  const sr28Columns = ['NDB_No', 'Shrt_Desc', 'Energ_Kcal'];
  const isSR28 = sr28Columns.some(col => columns.includes(col)) &&
                 (columns.includes('NDB_No') || columns.includes('Shrt_Desc'));
  
  if (isSR28) {
    // For SR28 format, we have special mappings
    const sr28MappedColumns = {
      'food_code': 'NDB_No',
      'food_name': 'Shrt_Desc',
      'calories': 'Energ_Kcal',
      'protein_g': 'Protein_(g)',
      'carbs_g': 'Carbohydrt_(g)',
      'fat_g': 'Lipid_Tot_(g)',
      'fiber_g': 'Fiber_TD_(g)',
      'sugar_g': 'Sugar_Tot_(g)',
      'sodium_mg': 'Sodium_(mg)',
      'vitamin_a_iu': 'Vit_A_IU',
      'vitamin_c_mg': 'Vit_C_(mg)',
      'vitamin_d_iu': 'Vit_D_IU',
      'calcium_mg': 'Calcium_(mg)',
      'iron_mg': 'Iron_(mg)',
      'potassium_mg': 'Potassium_(mg)'
    };
    
    // Check for required columns in SR28 format
    const missingColumns = requiredColumns.filter(col => {
      const sr28Column = sr28MappedColumns[col as keyof typeof sr28MappedColumns];
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
    missingColumns,
    isSR28: false
  };
}

/**
 * Function to detect if CSV is in SR28 format
 */
export function isSR28Format(csvData: string): boolean {
  if (!csvData) return false;
  
  // Get the header row
  const headerRow = csvData.split('\n')[0];
  if (!headerRow) return false;
  
  // Parse header columns
  const columns = headerRow
    .split(',')
    .map(col => col.trim().replace(/^"(.+)"$/, '$1'));
  
  // Check for key SR28 columns
  const sr28Columns = ['NDB_No', 'Shrt_Desc', 'Energ_Kcal', 'Protein_(g)', 'Lipid_Tot_(g)'];
  // If it has at least 3 of these columns, it's likely SR28 format
  const matchCount = sr28Columns.filter(col => columns.includes(col)).length;
  
  return matchCount >= 3 && columns.includes('NDB_No');
}

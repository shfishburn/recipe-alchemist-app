
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
      return { success: false, error: error.message };
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
): { isValid: boolean; missingColumns: string[] } {
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
  const isSR28 = sr28Columns.every(col => columns.includes(col));
  
  if (isSR28) {
    // For SR28 format, we have special mappings
    const sr28MappedColumns = {
      'food_code': 'NDB_No',
      'food_name': 'Shrt_Desc',
      // Add other mappings as needed
    };
    
    // Check for required columns in SR28 format
    const missingColumns = requiredColumns.filter(col => {
      const sr28Column = sr28MappedColumns[col as keyof typeof sr28MappedColumns];
      return sr28Column ? !columns.includes(sr28Column) : !columns.includes(col);
    });
    
    return {
      isValid: missingColumns.length === 0,
      missingColumns
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
  const requiredSR28Columns = ['NDB_No', 'Shrt_Desc', 'Energ_Kcal'];
  return requiredSR28Columns.every(col => columns.includes(col));
}

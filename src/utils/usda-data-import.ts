
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
      error: err instanceof Error ? err.message : 'Unknown error during import' 
    };
  }
}

/**
 * Helper function to read a CSV file
 */
export function readCsvFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
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
    return { isValid: false, missingColumns: [] };
  }

  // Parse header columns
  const columns = headerRow
    .split(',')
    .map(col => col.trim().replace(/^"(.+)"$/, '$1'));
  
  // Check for required columns
  const missingColumns = requiredColumns.filter(col => 
    !columns.find(c => c.toLowerCase() === col.toLowerCase())
  );

  return {
    isValid: missingColumns.length === 0,
    missingColumns
  };
}

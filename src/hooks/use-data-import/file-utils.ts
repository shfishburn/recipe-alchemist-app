
import { readCsvFile } from '@/utils/usda-data-import';
import { parseCsvData } from './csv-parser';
import { ValidationResult } from './types';

export async function processFile(
  file: File, 
  updateCsvPreview: (preview: string[][]) => void,
  updateParsingError: (error: string | null) => void
): Promise<void> {
  try {
    const csvData = await readCsvFile(file);
    
    // Parse and validate CSV format
    const parseResult = parseCsvData(csvData);
    
    if (!parseResult.success) {
      updateParsingError(parseResult.error || 'Failed to parse the CSV file');
      updateCsvPreview([]);
      return;
    }
    
    // Show preview (first 5 rows)
    const previewRows = parseResult.data.slice(0, 5);
    updateCsvPreview(previewRows);
    
    // Clear any previous errors
    updateParsingError(null);
  } catch (error) {
    console.error("Error reading file for preview:", error);
    updateParsingError(error instanceof Error ? error.message : 'Error reading file');
    updateCsvPreview([]);
    throw error;
  }
}

export async function validateFileContent(
  file: File,
  requiredColumns: string[],
  checkSr28Format: (data: string) => boolean
): Promise<ValidationResult> {
  try {
    const csvData = await readCsvFile(file);
    
    // First check if we can parse the CSV correctly
    const parseResult = parseCsvData(csvData);
    if (!parseResult.success) {
      throw new Error(parseResult.error || 'Failed to parse the CSV file');
    }
    
    // Check if this is SR28 format
    const sr28Check = checkSr28Format(csvData);
    
    // Get headers from the parse result
    const headers = parseResult.data[0];
    
    // Check if all required columns are present
    const missingColumns = requiredColumns.filter(col => {
      const normalized = col.toLowerCase();
      return !headers.some(h => h.toLowerCase() === normalized);
    });
    
    return {
      isValid: missingColumns.length === 0,
      missingColumns,
      isSR28: sr28Check
    };
  } catch (error) {
    console.error("Error validating file:", error);
    throw error;
  }
}

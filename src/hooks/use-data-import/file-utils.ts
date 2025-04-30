
import Papa from 'papaparse';
import { REQUIRED_COLUMNS } from './config';
import { isUSDAFormat, isSR28Format } from '@/utils/usda-data-import';

export interface ValidationResult {
  isValid: boolean;
  missingColumns: string[];
  isSR28?: boolean;
  isUSDA?: boolean;
}

/**
 * Process CSV file and extract preview data
 */
export async function processFile(
  file: File,
  setCsvPreview: (data: string[][]) => void,
  setParsingError: (error: string | null) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const csvString = reader.result as string;
        
        if (!csvString || csvString.trim() === '') {
          setParsingError('CSV file is empty');
          reject(new Error('CSV file is empty'));
          return;
        }
        
        // Parse CSV to get preview data
        Papa.parse(csvString, {
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              const errorMessage = `CSV parsing error: ${results.errors[0].message}`;
              setParsingError(errorMessage);
              reject(new Error(errorMessage));
              return;
            }
            
            // Take only first 5 rows for preview
            const data = results.data as string[][];
            const preview = data.slice(0, Math.min(6, data.length));
            setCsvPreview(preview);
            resolve();
          },
          error: (error) => {
            setParsingError(`CSV parsing error: ${error.message}`);
            reject(error);
          }
        });
      } catch (error) {
        setParsingError(`Error reading file: ${(error as Error).message}`);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      const errorMessage = `Error reading file: ${reader.error?.message || 'Unknown error'}`;
      setParsingError(errorMessage);
      reject(new Error(errorMessage));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validate CSV file content against required columns
 */
export async function validateFileContent(
  file: File,
  requiredColumns: string[],
  formatDetectors: { 
    isSR28: (headers: any) => boolean,
    isUSDA?: (headers: any) => boolean
  }
): Promise<ValidationResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const csvString = reader.result as string;
        
        if (!csvString || csvString.trim() === '') {
          reject(new Error('CSV file is empty'));
          return;
        }
        
        // Parse CSV to get header row
        Papa.parse(csvString, {
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
              return;
            }
            
            if (!results.data || results.data.length === 0) {
              reject(new Error('CSV file has no data'));
              return;
            }
            
            const headers = results.data[0] as string[];
            
            // Check for USDA format first if detector provided
            if (formatDetectors.isUSDA && formatDetectors.isUSDA(headers)) {
              const missingColumns = requiredColumns.filter(col => !headers.includes(col));
              resolve({
                isValid: missingColumns.length === 0,
                missingColumns,
                isUSDA: true
              });
              return;
            }
            
            // Check for SR28 format
            if (formatDetectors.isSR28(headers)) {
              // Validate SR28 format with specific requirements
              // This is simplified; in a real implementation, you'd check SR28-specific mappings
              const missingColumns = requiredColumns.filter(col => {
                // Simple check for illustration
                if (col === 'food_code') return !headers.includes('food_code');
                if (col === 'food_name') return !headers.includes('food_name');
                return !headers.includes(col);
              });
              
              resolve({
                isValid: missingColumns.length === 0,
                missingColumns,
                isSR28: true
              });
              return;
            }
            
            // Standard format validation
            const missingColumns = requiredColumns.filter(col => 
              !headers.find(h => h.toLowerCase() === col.toLowerCase())
            );
            
            resolve({
              isValid: missingColumns.length === 0,
              missingColumns
            });
          },
          error: (error) => {
            reject(new Error(`CSV parsing error: ${error.message}`));
          }
        });
      } catch (error) {
        reject(new Error(`Error reading file: ${(error as Error).message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(`Error reading file: ${reader.error?.message || 'Unknown error'}`));
    };
    
    reader.readAsText(file);
  });
}

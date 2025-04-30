
import Papa from 'papaparse';

export async function processFile(
  file: File,
  setCsvPreview: React.Dispatch<React.SetStateAction<string[][]>>,
  setParsingError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      preview: 5, // Show first 5 rows only for preview
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          setParsingError(results.errors[0].message);
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
        } else {
          setCsvPreview(results.data as string[][]);
          resolve();
        }
      },
      error: (error) => {
        setParsingError(error.message);
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
}

export async function validateFileContent(
  file: File, 
  requiredColumns: string[],
  formatCheckers: {
    isSR28: (headers: string[]) => boolean,
    isUSDA: (headers: string[]) => boolean
  }
): Promise<{
  isValid: boolean;
  missingColumns: string[];
  isSR28?: boolean;
  isUSDA?: boolean;
}> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 1, // Just need headers for validation
      complete: (results) => {
        try {
          if (!results.meta.fields || results.meta.fields.length === 0) {
            return resolve({
              isValid: false,
              missingColumns: ['No fields found in CSV'],
            });
          }
            
          const headers = results.meta.fields;
          const missingColumns = requiredColumns.filter(col => 
            !headers.some(h => h.toLowerCase() === col.toLowerCase())
          );
            
          const isSR28Format = formatCheckers.isSR28(headers);
          const isUSDAFormat = formatCheckers.isUSDA(headers);
            
          resolve({
            isValid: missingColumns.length === 0,
            missingColumns,
            isSR28: isSR28Format,
            isUSDA: isUSDAFormat
          });
        } catch (err) {
          reject(err);
        }
      },
      error: (error) => {
        reject(new Error(`CSV validation error: ${error.message}`));
      }
    });
  });
}


import { useState } from 'react';
import { 
  importUsdaData, 
  readCsvFile, 
  validateCsvFormat, 
  isSR28Format,
  UsdaTableType, 
  ImportResponse 
} from '@/utils/usda-data-import';
import { useToast } from '@/hooks/use-toast';

// Required columns for validation by table type
const REQUIRED_COLUMNS = {
  [UsdaTableType.USDA_FOODS]: ['food_code', 'food_name'],
  [UsdaTableType.UNIT_CONVERSIONS]: ['food_category', 'from_unit', 'to_unit', 'conversion_factor'],
  [UsdaTableType.YIELD_FACTORS]: ['food_category', 'cooking_method', 'yield_factor']
};

// SR28 columns mapping
const SR28_REQUIRED_COLUMNS = {
  [UsdaTableType.USDA_FOODS]: ['NDB_No', 'Shrt_Desc']
};

export function useDataImport() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTable, setSelectedTable] = useState<UsdaTableType>(UsdaTableType.USDA_FOODS);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    missingColumns: string[];
    isSR28?: boolean;
  } | null>(null);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  // Helper function to parse CSV data with error handling
  const parseCsvData = (csvData: string): { success: boolean; data: string[][]; error?: string } => {
    try {
      // Basic validation
      if (!csvData || csvData.trim() === '') {
        return { success: false, data: [], error: 'CSV file is empty' };
      }

      // Split by new lines
      const lines = csvData.split(/\r?\n/);
      if (lines.length < 2) {
        return { success: false, data: [], error: 'CSV file must have at least a header row and one data row' };
      }

      // Parse each line
      const parsedData = lines.map(line => {
        // Handle quoted values with commas inside them
        let inQuotes = false;
        let currentValue = '';
        const row: string[] = [];
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(currentValue.trim().replace(/^"(.+)"$/, '$1'));
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        row.push(currentValue.trim().replace(/^"(.+)"$/, '$1'));
        return row;
      });

      // Check for consistency in the number of columns
      const headerColumnCount = parsedData[0].length;
      const inconsistentRow = parsedData.findIndex(row => row.length !== headerColumnCount);
      
      if (inconsistentRow > 0) {
        return { 
          success: false, 
          data: [], 
          error: `Inconsistent column count at row ${inconsistentRow + 1}: Expected ${headerColumnCount} columns, got ${parsedData[inconsistentRow].length} columns` 
        };
      }

      return { success: true, data: parsedData };
    } catch (error) {
      console.error('Error parsing CSV data:', error);
      return { 
        success: false, 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error parsing CSV data' 
      };
    }
  };

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setValidationResult(null);
      setImportResult(null);
      setParsingError(null);
      
      try {
        const csvData = await readCsvFile(file);
        
        // Parse and validate CSV format
        const parseResult = parseCsvData(csvData);
        
        if (!parseResult.success) {
          setParsingError(parseResult.error || 'Failed to parse the CSV file');
          setCsvPreview([]);
          toast({
            title: "CSV Parsing Error",
            description: parseResult.error || 'Failed to parse the CSV file',
            variant: "destructive"
          });
          return;
        }
        
        // Show preview (first 5 rows)
        const previewRows = parseResult.data.slice(0, 5);
        setCsvPreview(previewRows);
        
        // Clear any previous errors
        setParsingError(null);
      } catch (error) {
        console.error("Error reading file for preview:", error);
        setParsingError(error instanceof Error ? error.message : 'Error reading file');
        setCsvPreview([]);
        toast({
          title: "File Reading Error",
          description: error instanceof Error ? error.message : 'Error reading the selected file',
          variant: "destructive"
        });
      }
    }
  };

  // Validate the selected CSV file
  const validateFile = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to validate.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    setParsingError(null);
    
    try {
      const csvData = await readCsvFile(selectedFile);
      
      // First check if we can parse the CSV correctly
      const parseResult = parseCsvData(csvData);
      if (!parseResult.success) {
        setParsingError(parseResult.error || 'Failed to parse the CSV file');
        toast({
          title: "CSV Parsing Error",
          description: parseResult.error || 'Failed to parse the CSV file',
          variant: "destructive"
        });
        setValidationResult({
          isValid: false,
          missingColumns: [],
          isSR28: false
        });
        return;
      }
      
      // Check if this is SR28 format
      const sr28Check = isSR28Format(csvData);
      
      // Use appropriate validation based on the format
      const columnsToCheck = sr28Check 
        ? SR28_REQUIRED_COLUMNS[selectedTable] || REQUIRED_COLUMNS[selectedTable]
        : REQUIRED_COLUMNS[selectedTable];
        
      const result = validateCsvFormat(csvData, columnsToCheck);
      setValidationResult({
        ...result,
        isSR28: sr28Check
      });
      
      if (result.isValid) {
        toast({
          title: "Validation successful",
          description: `CSV file is valid for import as ${sr28Check ? 'SR28' : 'standard'} format.`,
        });
      } else {
        toast({
          title: "Validation failed",
          description: `Missing required columns: ${result.missingColumns.join(', ')}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error validating file:", error);
      setParsingError(error instanceof Error ? error.message : 'Unknown error during validation');
      toast({
        title: "Validation error",
        description: error instanceof Error ? error.message : "An error occurred during validation.",
        variant: "destructive"
      });
      setValidationResult({
        isValid: false,
        missingColumns: [],
        isSR28: false
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Import the validated CSV file
  const importFile = async (options: { mode: 'insert' | 'upsert', batchSize: number }) => {
    if (!selectedFile || !validationResult?.isValid) {
      toast({
        title: "Cannot import",
        description: "Please select a valid CSV file and validate it first.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setParsingError(null);
    
    try {
      const csvData = await readCsvFile(selectedFile);
      
      // Final check before sending to API
      const parseResult = parseCsvData(csvData);
      if (!parseResult.success) {
        setParsingError(parseResult.error || 'Failed to parse the CSV file');
        toast({
          title: "CSV Parsing Error",
          description: parseResult.error || 'Failed to parse the CSV file before import',
          variant: "destructive"
        });
        return;
      }
      
      const result = await importUsdaData(csvData, selectedTable, {
        batchSize: options.batchSize || 100,
        mode: options.mode || 'insert'
      });
      
      setImportResult(result);
      
      if (result.success) {
        toast({
          title: "Import successful",
          description: `Successfully processed ${result.results?.totalRecords} records with ${result.results?.successCount} successful inserts as ${result.format} format.`,
        });
      } else {
        toast({
          title: "Import failed",
          description: result.error || "An unknown error occurred during import.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error importing file:", error);
      setParsingError(error instanceof Error ? error.message : 'Unknown error during import');
      toast({
        title: "Import error",
        description: error instanceof Error ? error.message : "An error occurred during import.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    selectedFile,
    selectedTable,
    setSelectedTable,
    isValidating,
    isImporting,
    validationResult,
    importResult,
    csvPreview,
    parsingError,
    handleFileChange,
    validateFile,
    importFile,
  };
}

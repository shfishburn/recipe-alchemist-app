
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

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setValidationResult(null);
      setImportResult(null);
      
      try {
        const csvData = await readCsvFile(file);
        // Generate a preview of the CSV data
        const lines = csvData.split('\n').slice(0, 5);
        const parsedPreview = lines.map(line => 
          line.split(',').map(cell => cell.trim().replace(/^"(.+)"$/, '$1'))
        );
        setCsvPreview(parsedPreview);
      } catch (error) {
        console.error("Error reading file for preview:", error);
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
    try {
      const csvData = await readCsvFile(selectedFile);
      
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
      toast({
        title: "Validation error",
        description: error instanceof Error ? error.message : "An error occurred during validation.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Import the validated CSV file
  const importFile = async () => {
    if (!selectedFile || !validationResult?.isValid) {
      toast({
        title: "Cannot import",
        description: "Please select a valid CSV file and validate it first.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      const csvData = await readCsvFile(selectedFile);
      const result = await importUsdaData(csvData, selectedTable, {
        batchSize: 100,
        mode: 'upsert'
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
    handleFileChange,
    validateFile,
    importFile,
  };
}

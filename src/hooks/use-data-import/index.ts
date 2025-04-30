
import { useState } from 'react';
import { 
  importUsdaData,
  isSR28Format,
  isUSDAFormat,
  UsdaTableType
} from '@/utils/usda-data-import';
import { useToast } from '@/hooks/use-toast';
import { processFile, validateFileContent } from './file-utils';
import { REQUIRED_COLUMNS, USDA_FILE_FORMATS } from './config';
import { ValidationResult, ImportResult, ImportOptions, UseDataImportReturn } from './types';

export function useDataImport(): UseDataImportReturn {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTable, setSelectedTable] = useState<UsdaTableType>(UsdaTableType.USDA_FOODS);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setValidationResult(null);
      setImportResult(null);
      setParsingError(null);
      
      try {
        await processFile(file, setCsvPreview, setParsingError);
        
        // Auto-detect file type based on name and content
        if (Object.values(USDA_FILE_FORMATS).some(format => 
          file.name.toLowerCase() === format.name.toLowerCase())) {
          // Auto-set the table type based on filename
          for (const [tableType, format] of Object.entries(USDA_FILE_FORMATS)) {
            if (file.name.toLowerCase() === format.name.toLowerCase()) {
              setSelectedTable(tableType as UsdaTableType);
              toast({
                title: "USDA File Format Detected",
                description: `Automatically selected table type: ${format.description}`,
              });
              break;
            }
          }
        }
      } catch (error) {
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
      // Use appropriate columns based on table type
      const columnsToCheck = REQUIRED_COLUMNS[selectedTable];
      
      // Validate file content
      const result = await validateFileContent(
        selectedFile, 
        columnsToCheck,
        {
          isSR28: isSR28Format,
          isUSDA: isUSDAFormat
        }
      );

      setValidationResult(result);
      
      if (result.isValid) {
        let formatDescription = 'standard';
        if (result.isSR28) formatDescription = 'SR28';
        if (result.isUSDA) formatDescription = 'USDA';
        
        toast({
          title: "Validation successful",
          description: `CSV file is valid for import as ${formatDescription} format.`,
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
        missingColumns: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Import the validated CSV file
  const importFile = async (options: ImportOptions) => {
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
      const result = await importUsdaData(await selectedFile.text(), selectedTable, {
        batchSize: options.batchSize,
        mode: options.mode
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

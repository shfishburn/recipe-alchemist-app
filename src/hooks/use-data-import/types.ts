
import { UsdaTableType } from "@/utils/usda-data-import";

export interface ValidationResult {
  isValid: boolean;
  missingColumns: string[];
  isSR28?: boolean;
}

export interface ImportResult {
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

export interface ImportOptions {
  mode: 'insert' | 'upsert';
  batchSize: number;
}

export interface UseDataImportReturn {
  selectedFile: File | null;
  selectedTable: UsdaTableType;
  setSelectedTable: (table: UsdaTableType) => void;
  isValidating: boolean;
  isImporting: boolean;
  validationResult: ValidationResult | null;
  importResult: ImportResult | null;
  csvPreview: string[][];
  parsingError: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validateFile: () => void;
  importFile: (options: ImportOptions) => void;
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, FileWarning, Info } from 'lucide-react';
import { ImportResponse } from '@/utils/usda-data-import';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ImportActionsProps {
  selectedFile: File | null;
  isValidating: boolean;
  isImporting: boolean;
  validationResult: { isValid: boolean; missingColumns: string[]; isSR28?: boolean } | null;
  importResult: ImportResponse | null;
  onValidate: () => void;
  onImport: () => void;
}

const ImportActions: React.FC<ImportActionsProps> = ({
  selectedFile,
  isValidating,
  isImporting,
  validationResult,
  importResult,
  onValidate,
  onImport
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button 
          onClick={onValidate} 
          disabled={!selectedFile || isValidating}
        >
          {isValidating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Validate CSV
        </Button>
        
        <Button 
          onClick={onImport} 
          disabled={!selectedFile || !validationResult?.isValid || isImporting}
          variant={validationResult?.isValid ? "default" : "outline"}
        >
          {isImporting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Import Data
        </Button>
      </div>
      
      {validationResult && (
        <Alert variant={validationResult.isValid ? "default" : "destructive"}>
          {validationResult.isValid ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {validationResult.isValid ? "Validation Passed" : "Validation Failed"}
          </AlertTitle>
          <AlertDescription>
            {validationResult.isValid 
              ? `The CSV file has all required columns and is ready for import${validationResult.isSR28 ? ' as SR28 format' : ' as standard format'}.`
              : `Missing required columns: ${validationResult.missingColumns.join(', ')}`
            }
          </AlertDescription>
        </Alert>
      )}
      
      {importResult && (
        <div className="space-y-4">
          <Alert variant={importResult.success ? "default" : "destructive"}>
            {importResult.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {importResult.success ? "Import Successful" : "Import Failed"}
            </AlertTitle>
            <AlertDescription>
              {importResult.success 
                ? `Successfully processed ${importResult.results?.totalRecords} records with ${importResult.results?.successCount} successful inserts as ${importResult.format || 'standard'} format.`
                : importResult.error
              }
            </AlertDescription>
          </Alert>

          {!importResult.success && importResult.details && importResult.details.length > 0 && (
            <Collapsible>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Error Details</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="rounded border p-3 mt-2">
                  <ul className="text-sm space-y-1">
                    {importResult.details.map((detail, index) => (
                      <li key={index} className="text-destructive">• {detail}</li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}
      
      {importResult?.success && importResult.results && (
        <div className="mt-2">
          <h3 className="text-sm font-medium mb-2">Batch Results</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Records Processed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importResult.results.batchResults.map((batch, index) => (
                <TableRow key={index}>
                  <TableCell>{batch.batch}</TableCell>
                  <TableCell>{batch.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ImportActions;

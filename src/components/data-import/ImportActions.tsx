
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, FileWarning, Info, RefreshCw } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ImportActionsProps {
  selectedFile: File | null;
  isValidating: boolean;
  isImporting: boolean;
  validationResult: { isValid: boolean; missingColumns: string[]; isSR28?: boolean } | null;
  importResult: ImportResponse | null;
  onValidate: () => void;
  onImport: (options: { mode: 'insert' | 'upsert', batchSize: number }) => void;
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
  const [importMode, setImportMode] = useState<'insert' | 'upsert'>('insert');
  const [batchSize, setBatchSize] = useState(100);
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Import Options</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Import Mode</h4>
            <RadioGroup 
              value={importMode} 
              onValueChange={(value) => setImportMode(value as 'insert' | 'upsert')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="insert" id="insert-mode" />
                <Label htmlFor="insert-mode">Insert (Add new records only)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upsert" id="upsert-mode" />
                <Label htmlFor="upsert-mode">Upsert (Update existing records)</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Use "Insert" for initial imports. Use "Upsert" to update existing records based on unique identifiers.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Batch Size</h4>
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250].map(size => (
                <Button 
                  key={size} 
                  type="button"
                  variant={batchSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBatchSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Smaller batch sizes are safer but slower. Larger batches are faster but may fail with large files.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button 
          onClick={onValidate} 
          disabled={!selectedFile || isValidating}
        >
          {isValidating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Validate CSV
        </Button>
        
        <Button 
          onClick={() => onImport({ mode: importMode, batchSize })} 
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

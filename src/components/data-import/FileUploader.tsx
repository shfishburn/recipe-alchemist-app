
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertCircle, FileWarning } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UsdaTableType } from '@/utils/usda-data-import';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  csvPreview: string[][];
  validationResult: { isValid: boolean; missingColumns: string[]; isSR28?: boolean; isUSDA?: boolean } | null;
  parsingError: string | null;
  selectedTable: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  selectedFile, 
  onFileChange,
  csvPreview,
  validationResult,
  parsingError,
  selectedTable
}) => {
  const [examples, setExamples] = useState<{
    id: number;
    table_name: string;
    sample_data: string;
    description: string;
  }[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const { toast } = useToast();

  // Track if this is a USDA raw table
  const isUsdaRawTable = selectedTable.startsWith('usda_raw.');

  // Load examples from database
  const loadExamples = async () => {
    if (examples.length > 0) return; // Only load once
    
    setLoadingExamples(true);
    try {
      const { data, error } = await supabase
        .from('import_examples')
        .select('*')
        .eq('table_name', selectedTable);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setExamples(data);
      }
    } catch (error) {
      console.error('Error loading examples:', error);
      toast({
        title: "Error loading examples",
        description: error instanceof Error ? error.message : "Failed to load example templates",
        variant: "destructive"
      });
    } finally {
      setLoadingExamples(false);
    }
  };

  // Download example as CSV
  const downloadExample = (example: string, description: string) => {
    const blob = new Blob([example], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${selectedTable}_example.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({
      title: "Example downloaded",
      description: `${description} CSV template has been downloaded.`
    });
  };

  // Helper function to render CSV preview
  const renderCsvPreview = () => {
    if (parsingError) {
      return (
        <Alert className="mt-4" variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>CSV Parsing Error</AlertTitle>
          <AlertDescription>
            {parsingError}
          </AlertDescription>
        </Alert>
      );
    }
    
    if (csvPreview.length === 0) return null;
    
    const headers = csvPreview[0];
    const rows = csvPreview.slice(1);
    
    // Limit the number of columns to display to prevent overflow
    const maxColumns = 10;
    const truncatedHeaders = headers.slice(0, maxColumns);
    const hasMoreColumns = headers.length > maxColumns;
    
    return (
      <div className="mt-4 overflow-x-auto">
        <h3 className="text-sm font-medium mb-2">CSV Preview (first {rows.length} rows)</h3>
        <Table className="border">
          <TableHeader>
            <TableRow>
              {truncatedHeaders.map((header, idx) => (
                <TableHead key={idx} className="whitespace-nowrap">
                  {header}
                </TableHead>
              ))}
              {hasMoreColumns && (
                <TableHead>...</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {row.slice(0, maxColumns).map((cell, cellIdx) => (
                  <TableCell key={cellIdx} className="whitespace-nowrap">
                    {cell}
                  </TableCell>
                ))}
                {hasMoreColumns && (
                  <TableCell>...</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {validationResult?.isSR28 && (
          <Alert className="mt-2" variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>SR28 Format Detected</AlertTitle>
            <AlertDescription>
              This CSV appears to be in USDA SR28 format. The system will automatically map SR28 columns to the required database fields.
            </AlertDescription>
          </Alert>
        )}
        {validationResult?.isUSDA && (
          <Alert className="mt-2" variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>USDA FoodData Central Format Detected</AlertTitle>
            <AlertDescription>
              This CSV appears to be in the USDA FoodData Central format. The system will automatically process this format for the selected table.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  // Helper to render file format guidelines
  const renderFormatGuidelines = () => {
    return (
      <Card className="p-4 mt-4 bg-muted/50">
        <h4 className="font-semibold mb-2">CSV Format Guidelines</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Use comma (,) as the delimiter</li>
          <li>Include headers in the first row</li>
          <li>Enclose text with commas in double quotes</li>
          <li>Ensure all rows have the same number of columns</li>
          {isUsdaRawTable ? (
            <li>This table expects original USDA FoodData Central CSV format</li>
          ) : (
            <li>The system supports both standard format and USDA SR28 format</li>
          )}
        </ul>
      </Card>
    );
  };

  // Render USDA raw import guidelines
  const renderUsdaImportGuidelines = () => {
    if (!isUsdaRawTable) return null;
    
    let fileDescription = '';
    let requiredColumns = '';
    
    switch (selectedTable) {
      case UsdaTableType.RAW_FOOD:
        fileDescription = 'Food.csv from FoodData Central';
        requiredColumns = 'fdc_id, description, publication_date';
        break;
      case UsdaTableType.RAW_MEASURE_UNIT:
        fileDescription = 'MeasureUnit.csv from FoodData Central';
        requiredColumns = 'id, name';
        break;
      case UsdaTableType.RAW_FOOD_PORTIONS:
        fileDescription = 'FoodPortions.csv from FoodData Central';
        requiredColumns = 'id, fdc_id, measure_unit_id, gram_weight';
        break;
      case UsdaTableType.RAW_YIELD_FACTORS:
        fileDescription = 'Manually formatted yield factors data';
        requiredColumns = 'food_category, ingredient, cooking_method, yield_factor';
        break;
    }
    
    return (
      <Alert className="mt-4">
        <Info className="h-4 w-4" />
        <AlertTitle>USDA Raw Data Import</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            This table is designed to import {fileDescription}.
          </p>
          <p className="mb-2">
            Required columns: <code className="bg-muted p-1 rounded">{requiredColumns}</code>
          </p>
          <p>
            Download files from the <a href="https://fdc.nal.usda.gov/download-datasets.html" target="_blank" rel="noopener noreferrer" className="text-primary underline">USDA FoodData Central</a> website.
          </p>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">File Upload</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {isUsdaRawTable 
          ? "Select a USDA FoodData Central CSV file to import into the raw table." 
          : "Select a CSV file to import into the table."}
      </p>
      
      {renderUsdaImportGuidelines()}
      
      <div className="flex items-center gap-4">
        <Button variant="outline" className="relative" onClick={() => document.getElementById('file-upload')?.click()}>
          <FileUp className="h-4 w-4 mr-2" />
          Select CSV File
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={onFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
        <div className="flex items-center">
          {selectedFile ? (
            <span className="text-sm font-medium">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              No file selected
            </span>
          )}
        </div>
      </div>

      {!selectedFile && (
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="examples">
            <AccordionTrigger 
              onClick={loadExamples}
              className="text-sm font-medium"
            >
              Download Example Templates
            </AccordionTrigger>
            <AccordionContent>
              {loadingExamples ? (
                <p className="text-sm text-muted-foreground">Loading examples...</p>
              ) : examples.length > 0 ? (
                <div className="space-y-2">
                  {examples.map((example) => (
                    <div key={example.id} className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <h5 className="font-medium text-sm">{example.description}</h5>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadExample(example.sample_data, example.description)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No example templates available for this table.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {!selectedFile && renderFormatGuidelines()}
      {renderCsvPreview()}
    </div>
  );
};

export default FileUploader;

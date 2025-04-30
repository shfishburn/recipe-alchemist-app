
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  csvPreview: string[][];
  validationResult: { isValid: boolean; missingColumns: string[]; isSR28?: boolean } | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  selectedFile, 
  onFileChange,
  csvPreview,
  validationResult
}) => {
  // Helper function to render CSV preview
  const renderCsvPreview = () => {
    if (csvPreview.length === 0) return null;
    
    const headers = csvPreview[0];
    const rows = csvPreview.slice(1);
    
    // Limit the number of columns to display to prevent overflow
    const maxColumns = 10;
    const truncatedHeaders = headers.slice(0, maxColumns);
    const hasMoreColumns = headers.length > maxColumns;
    
    return (
      <div className="mt-4 overflow-x-auto">
        <h3 className="text-sm font-medium mb-2">CSV Preview (first 4 rows)</h3>
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
      </div>
    );
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">File Upload</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Select a CSV file to import into the table.
      </p>
      
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
        <span className="text-sm">
          {selectedFile ? selectedFile.name : "No file selected"}
        </span>
      </div>
      
      {renderCsvPreview()}
    </div>
  );
};

export default FileUploader;

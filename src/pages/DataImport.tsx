
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
// Import the refactored hook
import { useDataImport } from '@/hooks/use-data-import';

import ImportHeader from '@/components/data-import/ImportHeader';
import TableSelection from '@/components/data-import/TableSelection';
import FileUploader from '@/components/data-import/FileUploader';
import ImportActions from '@/components/data-import/ImportActions';

const DataImport = () => {
  const { session } = useAuth();
  
  const {
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
  } = useDataImport();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container-page py-8">
        <ImportHeader />

        <TableSelection 
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
        />

        <Card className="p-6 mb-6">
          <FileUploader
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            csvPreview={csvPreview}
            validationResult={validationResult}
            parsingError={parsingError}
            selectedTable={selectedTable}
          />

          <Separator className="my-6" />

          <ImportActions
            selectedFile={selectedFile}
            isValidating={isValidating}
            isImporting={isImporting}
            validationResult={validationResult}
            importResult={importResult}
            onValidate={validateFile}
            onImport={importFile}
          />
        </Card>
      </main>
    </div>
  );
};

export default DataImport;


import React, { useState } from 'react';
import Navbar from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  importUsdaData, 
  readCsvFile, 
  validateCsvFormat, 
  UsdaTableType, 
  ImportResponse 
} from '@/utils/usda-data-import';
import { Separator } from '@/components/ui/separator';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import { CheckCircle2, FileUp, Info, Loader2, AlertCircle, ChevronRight, Database } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// Required columns for validation by table type
const REQUIRED_COLUMNS = {
  [UsdaTableType.USDA_FOODS]: ['food_code', 'food_name'],
  [UsdaTableType.UNIT_CONVERSIONS]: ['food_category', 'from_unit', 'to_unit', 'conversion_factor'],
  [UsdaTableType.YIELD_FACTORS]: ['food_category', 'cooking_method', 'yield_factor']
};

const DataImport = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTable, setSelectedTable] = useState<UsdaTableType>(UsdaTableType.USDA_FOODS);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    missingColumns: string[];
  } | null>(null);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setValidationResult(null);
      setImportResult(null);
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
      const result = validateCsvFormat(csvData, REQUIRED_COLUMNS[selectedTable]);
      setValidationResult(result);
      
      if (result.isValid) {
        toast({
          title: "Validation successful",
          description: "CSV file is valid for import.",
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
          description: `Successfully processed ${result.results?.totalRecords} records with ${result.results?.successCount} successful inserts.`,
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container-page py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Data Import</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center mb-6">
          <Database className="h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold">USDA Data Import</h1>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground">
            Import CSV data into the USDA database tables. Select a table type, upload a CSV file,
            validate its format, and then import the data.
          </p>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            Make sure your CSV file has the correct headers for the selected table type.
            For security reasons, only administrators should perform data imports.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="usda_foods" className="mb-6">
          <TabsList>
            <TabsTrigger 
              value="usda_foods" 
              onClick={() => setSelectedTable(UsdaTableType.USDA_FOODS)}
            >
              USDA Foods
            </TabsTrigger>
            <TabsTrigger 
              value="unit_conversions" 
              onClick={() => setSelectedTable(UsdaTableType.UNIT_CONVERSIONS)}
            >
              Unit Conversions
            </TabsTrigger>
            <TabsTrigger 
              value="yield_factors" 
              onClick={() => setSelectedTable(UsdaTableType.YIELD_FACTORS)}
            >
              Yield Factors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usda_foods" className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">USDA Foods Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Required columns: food_code, food_name
              </p>
              <p className="text-sm mb-4">
                This table stores nutritional information for various food items including calories,
                macronutrients, and micronutrients.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="unit_conversions" className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Unit Conversions Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Required columns: food_category, from_unit, to_unit, conversion_factor
              </p>
              <p className="text-sm mb-4">
                This table stores conversion factors between different units of measurement for
                various food categories.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="yield_factors" className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Yield Factors Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Required columns: food_category, cooking_method, yield_factor
              </p>
              <p className="text-sm mb-4">
                This table stores yield factors that account for weight changes during different
                cooking methods for various food categories.
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">File Upload</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select a CSV file to import into the {selectedTable} table.
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="relative" onClick={() => document.getElementById('file-upload')?.click()}>
                <FileUp className="h-4 w-4 mr-2" />
                Select CSV File
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </Button>
              <span className="text-sm">
                {selectedFile ? selectedFile.name : "No file selected"}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button 
                onClick={validateFile} 
                disabled={!selectedFile || isValidating}
              >
                {isValidating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Validate CSV
              </Button>
              
              <Button 
                onClick={importFile} 
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
                    ? "The CSV file has all required columns and is ready for import."
                    : `Missing required columns: ${validationResult.missingColumns.join(', ')}`
                  }
                </AlertDescription>
              </Alert>
            )}
            
            {importResult && (
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
                    ? `Successfully processed ${importResult.results?.totalRecords} records with ${importResult.results?.successCount} successful inserts.`
                    : importResult.error
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default DataImport;

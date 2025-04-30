
import React from 'react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { ChevronRight, Database, Info } from 'lucide-react';

const ImportHeader: React.FC = () => {
  return (
    <>
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
          The system supports both standard format and USDA SR28 format (with automatic column mapping).
          For security reasons, only administrators should perform data imports.
        </AlertDescription>
      </Alert>
    </>
  );
};

export default ImportHeader;

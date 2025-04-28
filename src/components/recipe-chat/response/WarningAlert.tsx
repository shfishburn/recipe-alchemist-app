
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface WarningAlertProps {
  showWarning: boolean;
  isMobile?: boolean;
}

export function WarningAlert({ showWarning, isMobile = false }: WarningAlertProps) {
  if (!showWarning) return null;
  
  const alertPadding = isMobile ? "p-2 sm:p-4" : "p-4";
  
  return (
    <Alert variant="destructive" className={`mb-2 sm:mb-4 text-xs sm:text-sm ${alertPadding}`}>
      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
      <AlertTitle className="text-xs sm:text-sm">Warning</AlertTitle>
      <AlertDescription className="text-xs sm:text-sm">
        Some suggested changes may need review. Please check the ingredient quantities carefully.
      </AlertDescription>
    </Alert>
  );
}

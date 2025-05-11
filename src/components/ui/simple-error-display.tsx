
import React from 'react';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function SimpleErrorDisplay({ 
  error, 
  onRetry, 
  onCancel 
}: SimpleErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg border border-red-200 dark:border-red-900">
      <div className="flex flex-col items-center text-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Recipe Generation Failed</h2>
        <p className="text-muted-foreground">{error}</p>
        
        <div className="flex flex-row gap-3 pt-2">
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          )}
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="flex items-center gap-2 bg-recipe-green hover:bg-recipe-green/90"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

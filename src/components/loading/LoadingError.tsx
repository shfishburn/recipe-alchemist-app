
import React from 'react';
import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingErrorProps {
  error: string | null;
  hasTimeoutError: boolean;
  onCancel: () => void;
  onRetry: () => void;
  isRetrying: boolean;
  formData: any;
}

export function LoadingError({ 
  error, 
  hasTimeoutError, 
  onCancel, 
  onRetry, 
  isRetrying,
  formData
}: LoadingErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h2 className="text-xl font-semibold">Recipe Generation Failed</h2>
      <p className="text-muted-foreground">{error}</p>
      
      {/* Timeout message */}
      {hasTimeoutError && (
        <div className="mt-4 p-3 rounded-lg text-sm bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">This request timed out</span>
          </div>
          <p className="text-xs">
            Try again with a simpler recipe request or fewer ingredients.
          </p>
        </div>
      )}
      
      <div className="flex flex-row gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Start Over
        </Button>
        
        {formData && (
          <Button 
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

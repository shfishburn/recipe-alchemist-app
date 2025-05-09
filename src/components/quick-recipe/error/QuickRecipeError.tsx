
import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickRecipeErrorProps {
  error: string;
  hasTimeoutError: boolean;
  debugMode: boolean;
  formData: any;
  onCancel: () => void;
  onRetry: () => void;
  isRetrying: boolean;
}

export function QuickRecipeError({
  error,
  hasTimeoutError,
  debugMode,
  formData,
  onCancel,
  onRetry,
  isRetrying
}: QuickRecipeErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 border rounded-xl bg-red-50 dark:bg-red-900/10">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Recipe Generation Failed</h2>
      <p className="text-muted-foreground mb-6">{error}</p>
      
      {hasTimeoutError && (
        <div className="text-sm text-muted-foreground mb-4 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
          <p className="font-medium">Tip for timeout errors:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Try a simpler ingredient or combination</li>
            <li>Check your internet connection</li>
            <li>Wait a moment and try again</li>
          </ul>
        </div>
      )}
      
      {/* Debug info only shown when debug mode is enabled */}
      {debugMode && formData && (
        <div className="w-full mb-4 text-xs bg-gray-50 p-3 rounded overflow-auto max-h-48 text-left">
          <div className="font-semibold mb-1">Debug Information:</div>
          <pre className="whitespace-pre-wrap">{JSON.stringify({
            formData,
            hasTimeoutError,
            error
          }, null, 2)}</pre>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Start Over
        </Button>
        {formData && (
          <Button 
            onClick={onRetry}
            className="flex items-center gap-2"
            disabled={isRetrying}
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        )}
      </div>
    </div>
  );
}

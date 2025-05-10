
import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string | null;
  onCancel?: () => void;
  onRetry?: () => void;
}

export function ErrorState({ error, onCancel, onRetry }: ErrorStateProps) {
  // Ensure we have a default error message if error is null or empty
  const errorMessage = error || "An unexpected error occurred while generating your recipe";
  
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 animate-scale-in bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Recipe Generation Failed</h2>
      <p className="text-muted-foreground mb-6">{errorMessage}</p>
      
      <div className="flex flex-row space-x-3">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Start Over
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
  );
}

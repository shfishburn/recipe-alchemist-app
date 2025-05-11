
import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from '@/styles/loading.module.css';

interface ErrorStateProps {
  error: string | null;
  onCancel?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({ error, onCancel, onRetry, isRetrying = false }: ErrorStateProps) {
  // Ensure we have a default error message if error is null or empty
  const errorMessage = error || "An unexpected error occurred while generating your recipe";
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Recipe Generation Failed</h2>
        <p className="text-muted-foreground">{errorMessage}</p>
      </div>
      
      <div className="flex flex-row gap-3 pt-2">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex items-center gap-2"
            disabled={isRetrying}
          >
            <ArrowLeft className="h-4 w-4" />
            Start Over
          </Button>
        )}
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="flex items-center gap-2 bg-recipe-green hover:bg-recipe-green/90"
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

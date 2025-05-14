
import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <div className={cn(
      "flex flex-col items-center justify-center space-y-6 p-6 text-center",
      "rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
      "border border-red-100 dark:border-red-900/30",
      "shadow-elevation-1 animate-scale-in"
    )}>
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center",
        "bg-red-50 dark:bg-red-900/20"
      )}>
        <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-medium">Recipe Generation Failed</h2>
        <p className="text-muted-foreground">{errorMessage}</p>
      </div>
      
      <div className="flex flex-row gap-3 pt-2">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            className={cn(
              "flex items-center gap-2 h-auto py-2 px-4",
              "transition-all duration-200 relative overflow-hidden",
              "border border-gray-200 dark:border-gray-700"
            )}
            disabled={isRetrying}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Start Over</span>
            <span className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity rounded-md" />
          </Button>
        )}
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            className={cn(
              "flex items-center gap-2 h-auto py-2 px-4", 
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "transition-all duration-200 relative overflow-hidden"
            )}
            disabled={isRetrying}
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-md" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;

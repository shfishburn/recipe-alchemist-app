
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  className?: string;
  title?: string;
}

export function ErrorDisplay({ error, onRetry, className, title }: ErrorDisplayProps) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  if (!error) return null;
  
  const handleRetry = () => {
    setRetryCount(count => count + 1);
    if (onRetry) onRetry();
  };
  
  const getErrorMessage = () => {
    if (error?.message?.includes('PGRST301')) {
      return 'Could not find your profile. It may have been deleted.';
    }
    
    if (error?.message?.includes('PGRST401') || error?.message?.includes('auth')) {
      return 'You are not authorized to access this profile.';
    }
    
    if (error?.message?.includes('network') || error?.message?.includes('connection')) {
      return 'Network error. Please check your connection.';
    }
    
    return error?.message || 'An unexpected error occurred.';
  };
  
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
      className
    )}>
      <div className="flex flex-col items-center text-center gap-4">
        <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden="true" />
        <h3 className="text-lg font-semibold">{title || getErrorMessage()}</h3>
        <p className="text-sm text-muted-foreground">
          {retryCount >= maxRetries 
            ? 'Maximum retry attempts reached. Please try again later.' 
            : 'We encountered an error while loading your profile.'}
        </p>
        {retryCount < maxRetries && onRetry && (
          <Button 
            onClick={handleRetry} 
            variant="outline"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, title = "Error", className = "" }: ErrorDisplayProps) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  if (!error) return null;
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (onRetry) onRetry();
  };
  
  const getErrorMessage = () => {
    if (!error) return "";
    
    const message = error.message || 'An unexpected error occurred.';
    
    // Handle specific error types
    if (message.includes('PGRST301')) {
      return 'Could not find your profile data. It may have been deleted.';
    }
    
    if (message.includes('PGRST401') || message.includes('JWT')) {
      return 'You are not authorized to access this data. Please log in again.';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return message;
  };
  
  return (
    <Alert variant="destructive" className={`mb-4 ${className}`}>
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="text-sm mb-3">{getErrorMessage()}</div>
        {onRetry && retryCount < maxRetries && (
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            size="sm"
            className="mt-2 bg-background/50 hover:bg-background/80 border-destructive"
          >
            Try Again
          </Button>
        )}
        {retryCount >= maxRetries && (
          <p className="text-xs mt-2 italic">
            Maximum retry attempts reached. Please try again later.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

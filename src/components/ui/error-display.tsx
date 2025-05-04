
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorDisplayProps {
  /**
   * Error object or message to display
   */
  error: Error | string | null | unknown;
  
  /**
   * Title for the error display
   * @default "Something went wrong"
   */
  title?: string;
  
  /**
   * If provided, enables retry functionality with this callback
   */
  onRetry?: () => void;
  
  /**
   * If true, shows the full error stack trace (useful for development)
   * @default false
   */
  showStack?: boolean;
  
  /**
   * Custom CSS class name
   */
  className?: string;
  
  /**
   * Variant for styling
   */
  variant?: 'default' | 'subtle' | 'destructive' | 'inline';
  
  /**
   * Size variant
   */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Extract readable message from an error object
 */
function getErrorMessage(error: Error | string | unknown | null): string {
  if (error === null || error === undefined) {
    return 'Unknown error occurred';
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message || error.toString();
  }
  
  if (typeof error === 'object') {
    // Try to extract message property if it exists
    const anyError = error as any;
    if (anyError.message && typeof anyError.message === 'string') {
      return anyError.message;
    }
  }
  
  return String(error);
}

/**
 * Standardized error display component for consistent error presentation
 */
export function ErrorDisplay({
  error,
  title = "Something went wrong",
  onRetry,
  showStack = false,
  className,
  variant = 'default',
  size = 'default'
}: ErrorDisplayProps) {
  const errorMessage = getErrorMessage(error);
  const errorStack = error instanceof Error ? error.stack : null;
  
  // Handle different variants
  if (variant === 'inline') {
    return (
      <div className={cn(
        "flex items-center text-destructive gap-2 px-3 py-2 rounded-md bg-destructive/10",
        size === 'sm' ? "text-sm" : "text-base",
        className
      )}>
        <AlertCircle className={cn(
          "flex-shrink-0", 
          size === 'sm' ? "h-4 w-4" : "h-5 w-5"
        )} />
        <div className="flex-1">{errorMessage}</div>
        {onRetry && (
          <Button 
            variant="ghost" 
            size={size === 'sm' ? 'icon' : 'sm'} 
            onClick={onRetry}
            className="flex-shrink-0"
          >
            <RefreshCw className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />
          </Button>
        )}
      </div>
    );
  }
  
  // Card-based display for other variants
  return (
    <Card className={cn(
      variant === 'destructive' ? "border-destructive/50" : "",
      variant === 'subtle' ? "bg-muted/50 border-muted" : "",
      size === 'sm' ? "text-sm" : "",
      size === 'lg' ? "p-6" : "",
      className
    )}>
      <CardHeader className={cn(
        "pb-2",
        variant === 'destructive' ? "text-destructive" : ""
      )}>
        <div className="flex items-center gap-2">
          <AlertCircle className={size === 'sm' ? "h-4 w-4" : "h-5 w-5"} />
          <h3 className="font-semibold">{title}</h3>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={cn(
          "text-muted-foreground",
          variant === 'destructive' ? "text-destructive/80" : ""
        )}>
          {errorMessage}
        </p>
        
        {showStack && errorStack && (
          <pre className="mt-4 p-2 bg-muted/50 rounded text-xs overflow-auto max-h-[200px]">
            {errorStack}
          </pre>
        )}
      </CardContent>
      
      {onRetry && (
        <CardFooter className="pt-2">
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            size={size === 'sm' ? 'sm' : 'default'}
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default ErrorDisplay;

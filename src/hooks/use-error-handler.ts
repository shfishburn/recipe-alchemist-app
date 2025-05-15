
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Options for error handling behavior
 */
interface ErrorHandlerOptions {
  /**
   * Show toast notification on error
   * @default true
   */
  showToast?: boolean;
  
  /**
   * Custom toast title for errors
   * @default "Error"
   */
  toastTitle?: string;
  
  /**
   * Toast duration in milliseconds
   * @default 5000
   */
  toastDuration?: number;
  
  /**
   * Custom error formatter
   */
  formatError?: (error: any) => string;
}

/**
 * Result object from useErrorHandler
 */
interface ErrorHandlerResult {
  /** Current error object */
  error: Error | null;
  
  /** Flag indicating if there is an error */
  hasError: boolean;
  
  /** Function to set an error */
  setError: (error: any) => void;
  
  /** Function to clear the current error */
  clearError: () => void;
  
  /** Function to handle errors from promises or try/catch blocks */
  handleError: (error: any) => void;
}

/**
 * Extract readable message from error object
 */
const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  if (typeof error === 'string') return error;
  return error.message || error.toString() || 'Unknown error occurred';
};

/**
 * Hook for standardized error handling across the application
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}): ErrorHandlerResult {
  const {
    showToast = true,
    toastTitle = 'Error',
    toastDuration = 5000,
    formatError = getErrorMessage
  } = options;
  
  // State to track current error
  const [error, setErrorState] = useState<Error | null>(null);

  // Set error with option to show toast
  const setError = useCallback((err: any) => {
    // Convert to Error object if it's not already
    const errorObject = err instanceof Error ? err : new Error(formatError(err));
    
    // Update error state
    setErrorState(errorObject);
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error(toastTitle, {
        description: formatError(err),
        duration: toastDuration
      });
    }
    
    // Log error for debugging
    console.error('Error handled:', err);
    
    return errorObject;
  }, [showToast, toastTitle, toastDuration, formatError]);
  
  // Clear current error
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);
  
  // Handle errors from promises or try/catch blocks
  const handleError = useCallback((err: any) => {
    return setError(err);
  }, [setError]);
  
  return {
    error,
    hasError: error !== null,
    setError,
    clearError,
    handleError
  };
}

export default useErrorHandler;

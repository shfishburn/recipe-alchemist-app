
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
  
  /**
   * Log errors to console
   * @default true
   */
  logToConsole?: boolean;
  
  /**
   * Track error counts for circuit-breaking
   * @default false
   */
  trackErrorCounts?: boolean;
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
  
  /** Current error count (if tracking is enabled) */
  errorCount: number;
  
  /** Reset error count to zero */
  resetErrorCount: () => void;
  
  /** Check if error threshold has been exceeded */
  isThresholdExceeded: (threshold?: number) => boolean;
}

/**
 * Extract readable message from error object with enhanced extraction
 */
const getErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error occurred';
  if (typeof error === 'string') return error;
  
  // Try to extract the most meaningful message
  const message = error.message || error.toString() || 'Unknown error occurred';
  
  // Handle network errors specifically
  if (message.includes('fetch') || message.includes('network') || 
      error.name === 'NetworkError' || error.name === 'AbortError') {
    return 'Network error: Please check your connection';
  }
  
  // Handle timeout errors
  if (message.includes('timeout')) {
    return 'Request timed out: Please try again';
  }
  
  // Handle authentication errors
  if (message.includes('401') || message.includes('auth') || 
      message.includes('unauthorized') || message.includes('sign in')) {
    return 'Authentication error: Please sign in again';
  }
  
  // Handle permission errors
  if (message.includes('403') || message.includes('permission') || 
      message.includes('forbidden')) {
    return 'Permission error: You do not have access to this resource';
  }
  
  // Handle server errors
  if (message.includes('500') || message.includes('server')) {
    return 'Server error: Please try again later';
  }
  
  return message;
};

/**
 * Enhanced hook for standardized error handling across the application
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}): ErrorHandlerResult {
  const {
    showToast = true,
    toastTitle = 'Error',
    toastDuration = 5000,
    formatError = getErrorMessage,
    logToConsole = true,
    trackErrorCounts = false
  } = options;
  
  // State to track current error
  const [error, setErrorState] = useState<Error | null>(null);
  
  // Track error count for circuit breaking
  const [errorCount, setErrorCount] = useState<number>(0);

  // Reset error count
  const resetErrorCount = useCallback(() => {
    setErrorCount(0);
  }, []);
  
  // Check if error threshold is exceeded
  const isThresholdExceeded = useCallback((threshold = 3) => {
    return errorCount >= threshold;
  }, [errorCount]);

  // Set error with option to show toast
  const setError = useCallback((err: any) => {
    // Convert to Error object if it's not already
    const errorObject = err instanceof Error ? err : new Error(formatError(err));
    
    // Update error state
    setErrorState(errorObject);
    
    // Increment error count if tracking is enabled
    if (trackErrorCounts) {
      setErrorCount(count => count + 1);
    }
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error(toastTitle, {
        description: formatError(err),
        duration: toastDuration
      });
    }
    
    // Log error for debugging
    if (logToConsole) {
      console.error('[Error Handler]', err);
      
      // Add stack trace for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Stack trace:', errorObject.stack);
      }
    }
    
    return errorObject;
  }, [showToast, toastTitle, toastDuration, formatError, trackErrorCounts, logToConsole]);
  
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
    handleError,
    errorCount,
    resetErrorCount,
    isThresholdExceeded
  };
}

export default useErrorHandler;

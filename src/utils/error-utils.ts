
/**
 * Utils for handling errors consistently across the application
 */

/**
 * Formats an error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
}

/**
 * Logs an error with consistent formatting
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}] Error:`, error);
  
  if (error instanceof Error && error.stack) {
    console.error(`[${context}] Stack trace:`, error.stack);
  }
}

/**
 * Creates a standardized error response object
 */
export function createErrorResponse(error: unknown, context?: string) {
  const message = formatErrorMessage(error);
  const errorContext = context || 'application';
  
  logError(errorContext, error);
  
  return {
    error: true,
    message,
    context: errorContext,
    timestamp: new Date().toISOString()
  };
}

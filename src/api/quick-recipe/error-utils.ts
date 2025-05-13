
// Error handling utilities for quick recipe API

export const processErrorResponse = (error: any) => {
  console.error('Error processing recipe generation:', error);
  
  // Default error message
  let errorMessage = 'An error occurred while generating the recipe';
  let isTimeout = false;
  
  // Get message from Error object or string
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    // Extract error from response object if available
    errorMessage = error.error || error.message || error.details || errorMessage;
  }
  
  // Check for common error patterns
  if (typeof errorMessage === 'string') {
    const lowerCaseMsg = errorMessage.toLowerCase();
    isTimeout = lowerCaseMsg.includes('timeout') || 
                lowerCaseMsg.includes('timed out') || 
                lowerCaseMsg.includes('aborted');
  }
  
  return {
    message: errorMessage,
    isTimeout,
    timestamp: new Date().toISOString()
  };
};


// Utility functions for handling timeouts in API requests

// Set a timeout for the request to prevent indefinite loading
export const createTimeoutPromise = (duration: number = 120000): Promise<never> => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Recipe generation timed out. Please try again with a simpler request.")), duration);
  });
};

// Function to abort a fetch request after a timeout
export const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 120000) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

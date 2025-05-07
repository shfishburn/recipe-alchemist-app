
// Utility functions for handling timeouts in API requests

// Set a timeout for the request to prevent indefinite loading
export const createTimeoutPromise = (duration: number = 120000): Promise<never> => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Recipe generation timed out. Please try again with a simpler request.")), duration);
  });
};

// Function to abort a fetch request after a timeout
export const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 120000) => {
  // Use standard AbortController
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
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Recipe generation request timed out. Please try with a simpler recipe request.');
    }
    
    throw error;
  }
};

// Create a fetch request with retry capabilities and connection status detection
export const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  maxRetries: number = 3,
  baseDelay: number = 1000
) => {
  let lastError: Error | null = null;
  
  // First check if online
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('You appear to be offline. Please check your internet connection and try again.');
  }
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add attempt number to headers for tracking
      const headers = new Headers(options.headers);
      headers.set('X-Retry-Attempt', attempt.toString());
      headers.set('X-Client-Timestamp', Date.now().toString());
      
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1} to fetch from ${url}`);
      
      // Use fetch with timeout for each attempt
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout per attempt
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
      lastError = error as Error;
      
      // Check if error is due to being offline
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('You appear to be offline. Please check your internet connection and try again.');
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(`Retrying in ${Math.round(delay / 1000)} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('All fetch attempts failed');
};

// Check if the browser has connectivity to a specific URL
export const checkConnectivity = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
      mode: 'cors',
      credentials: 'omit'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (e) {
    console.warn("Connectivity check failed:", e);
    return false;
  }
};


import { useState, useCallback } from 'react';
import { useLoadingState } from '@/hooks/use-loading-state';

/**
 * Type for API request options
 */
export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  timeout?: number;
};

/**
 * Utility for making API requests
 */
export const apiRequest = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { 
    method = 'GET', 
    headers = {}, 
    body = null, 
    signal,
    timeout = 30000 
  } = options;
  
  // Create a timeout controller
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeout);
  
  // Combine both signals if provided
  let finalSignal = signal;
  if (signal && timeoutController.signal) {
    finalSignal = signal;
    signal.addEventListener('abort', () => timeoutController.abort());
  } else {
    finalSignal = timeoutController.signal;
  }
  
  try {
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      signal: finalSignal
    };
    
    // Add body if provided
    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    // Make the request
    const response = await fetch(url, fetchOptions);
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    // Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    // Return empty object for no-content responses
    return {} as T;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    
    throw error;
  }
};

/**
 * Hook for making API requests with loading states
 */
export function useApiRequest() {
  const [data, setData] = useState<any>(null);
  const {
    isLoading,
    isError,
    isSuccess,
    error,
    setLoading,
    setSuccess,
    setError,
    reset
  } = useLoadingState();
  
  // Reference to the abort controller
  const abortControllerRef = React.useRef<AbortController | null>(null);
  
  // Abort current request
  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  
  // Make request with provided options
  const request = useCallback(async <T>(url: string, options: ApiRequestOptions = {}): Promise<T | null> => {
    // Reset states
    reset();
    setLoading();
    
    // Abort any ongoing request
    abortRequest();
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      // Make the request with the abort signal
      const result = await apiRequest<T>(url, {
        ...options,
        signal: abortControllerRef.current.signal
      });
      
      // Update states
      setData(result);
      setSuccess();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    }
  }, [reset, setLoading, abortRequest, setData, setSuccess, setError]);
  
  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      abortRequest();
    };
  }, [abortRequest]);
  
  return {
    request,
    abortRequest,
    data,
    isLoading,
    isError,
    isSuccess,
    error,
    reset
  };
}

export default useApiRequest;

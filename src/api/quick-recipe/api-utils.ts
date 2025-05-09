import { supabase } from '@/integrations/supabase/client';

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  return await supabase.auth.getSession()
    .then(res => res.data.session?.access_token || '');
};

// Helper function to add delay with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Direct API fetch to edge function with improved resilience
export const fetchFromEdgeFunction = async (requestBody: any, signal?: AbortSignal): Promise<any> => {
  try {
    // Check if the request has been aborted already
    if (signal?.aborted) {
      console.log("Request already aborted before fetch started");
      throw new DOMException("Request aborted by user", "AbortError");
    }
    
    // Get auth token for request
    const token = await getAuthToken();
    
    console.log("Testing direct fetch to edge function");
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002' // Include model in request body
    };
    
    // IMPROVED ERROR HANDLING: Add retries and better error messages
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;
    
    while (retryCount <= maxRetries) {
      try {
        // Add delay with exponential backoff for retries
        if (retryCount > 0) {
          const backoffMs = 500 * Math.pow(2, retryCount);
          console.log(`Retry ${retryCount}/${maxRetries} after ${backoffMs}ms backoff...`);
          await delay(backoffMs);
        }
        
        // Make the direct fetch request with CORS-compatible headers
        const response = await fetch('https://zjyfumqfrtppleftpzjd.supabase.co/functions/v1/generate-quick-recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Debug-Info': 'direct-fetch-production-' + Date.now(),
          },
          body: JSON.stringify(payload),
          signal, // Pass the abort signal to the fetch request
          // Add explicit timeout
          cache: 'no-cache',
          keepalive: true, // Keep connection alive
        });
        
        // Check if request was aborted during the fetch
        if (signal?.aborted) {
          console.log("Request aborted during fetch operation");
          throw new DOMException("Request aborted by user", "AbortError");
        }
        
        console.log("Direct fetch response status:", response.status);
        const responseText = await response.text();
        console.log("Direct fetch response:", responseText);
        
        // Check if the response is OK
        if (!response.ok) {
          try {
            const errorJson = JSON.parse(responseText);
            throw new Error(errorJson.error || `API returned status ${response.status}`);
          } catch (e) {
            throw new Error(`API returned status ${response.status}: ${responseText.substring(0, 100)}`);
          }
        }
        
        // Parse and return the successful response
        try {
          const data = JSON.parse(responseText);
          console.log("Direct fetch parsed JSON:", data);
          return data;
        } catch (parseError) {
          console.error("Direct fetch response is not valid JSON:", responseText);
          throw new Error("Invalid JSON response from API");
        }
      } catch (fetchError: any) {
        // Check if this is an abort error
        if (fetchError.name === 'AbortError' || signal?.aborted) {
          console.log("Direct fetch aborted by user");
          throw new DOMException("Request aborted by user", "AbortError");
        }
        
        // Check if this is a network error or timeout that we should retry
        const isNetworkError = 
          fetchError.message?.includes('Load failed') || 
          fetchError.message?.includes('network') ||
          fetchError.message?.includes('NetworkError') ||
          fetchError.message?.includes('timeout') ||
          fetchError.name === 'TypeError';
          
        if (retryCount < maxRetries && isNetworkError) {
          console.warn(`Fetch attempt ${retryCount + 1}/${maxRetries + 1} failed, retrying...`, fetchError);
          lastError = fetchError;
          retryCount++;
          continue;
        }
        
        console.error("Direct fetch error:", fetchError);
        throw fetchError;
      }
    }
    
    // If we've exhausted retries, throw the last error
    throw lastError || new Error('Failed to connect to recipe service after multiple attempts');
  } catch (fetchError: any) {
    // Properly handle AbortError to avoid showing error messages when the user cancels
    if (fetchError.name === 'AbortError' || signal?.aborted) {
      console.log("Fetch aborted by user, no error needed");
      throw new DOMException("Request aborted by user", "AbortError");
    }
    console.error("Direct fetch error:", fetchError);
    throw fetchError;
  }
};

// Fallback API call using Supabase functions with improved resilience
export const fetchFromSupabaseFunctions = async (requestBody: any, signal?: AbortSignal): Promise<any> => {
  // Check if request already aborted
  if (signal?.aborted) {
    console.log("Request already aborted before Supabase function call");
    throw new DOMException("Request aborted by user", "AbortError");
  }
  
  try {
    console.log("Falling back to Supabase functions invoke");
    
    // Use a timeout that respects the abort signal
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Create a timeout promise that respects abort signal
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Recipe generation timed out. Please try again."));
      }, 60000); // 60 second timeout
      
      // If signal is provided, cancel the timeout on abort
      if (signal) {
        signal.addEventListener('abort', () => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(new DOMException("Request aborted by user", "AbortError"));
        });
      }
    });
    
    // IMPROVED ERROR HANDLING: Add retries for supabase invoke
    let retryCount = 0;
    const maxRetries = 3;
    let lastError = null;
    
    while (retryCount <= maxRetries) {
      try {
        // Add delay with exponential backoff for retries
        if (retryCount > 0) {
          const backoffMs = 800 * Math.pow(2, retryCount);
          console.log(`Supabase invoke retry ${retryCount}/${maxRetries} after ${backoffMs}ms backoff...`);
          await delay(backoffMs);
        }
        
        // Create a special options object that enables keepalive
        const invokeOptions = {
          body: {
            ...requestBody,
            embeddingModel: 'text-embedding-ada-002' // Include model in request body
          },
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Info': 'supabase-invoke-' + Date.now(),
            'Connection': 'keep-alive'
          }
        };

        // Race invocation against timeout
        const invocationPromise = supabase.functions.invoke('generate-quick-recipe', invokeOptions);
        
        const { data, error } = await Promise.race([
          invocationPromise,
          timeoutPromise.then(() => {
            throw new Error("Recipe generation timed out. Please try again.");
          })
        ]) as { data?: any, error?: any };
        
        // Clear timeout if promise resolved
        if (timeoutId) clearTimeout(timeoutId);
        
        // Check for abort after resolution
        if (signal?.aborted) {
          console.log("Request aborted during Supabase function call");
          throw new DOMException("Request aborted by user", "AbortError");
        }
        
        if (error) {
          console.error('Supabase functions error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No data returned from recipe generation');
        }

        return data;
      } catch (error: any) {
        // Check if this is an abort error or if signal is aborted
        if (error.name === 'AbortError' || signal?.aborted) {
          console.log("Supabase function call aborted by user");
          throw new DOMException("Request aborted by user", "AbortError");
        }
        
        // Check if this is a network error that we should retry
        const isNetworkError = 
          error.message?.includes('Failed to send') || 
          error.message?.includes('network') ||
          error.message?.includes('Load failed') || 
          error.name === 'FunctionsFetchError' ||
          error.name === 'TypeError';
          
        if (retryCount < maxRetries && isNetworkError) {
          console.warn(`Supabase invoke attempt ${retryCount + 1}/${maxRetries + 1} failed, retrying...`, error);
          lastError = error;
          retryCount++;
          continue;
        }
        
        console.error("Supabase function error:", error);
        throw error;
      }
    }
    
    // If we've exhausted retries, throw the last error
    throw lastError || new Error('Failed to connect to recipe service after multiple attempts');
  } catch (error: any) {
    // Check if this is an abort error or if signal is aborted
    if (error.name === 'AbortError' || signal?.aborted) {
      console.log("Supabase function call aborted by user");
      throw new DOMException("Request aborted by user", "AbortError");
    }
    console.error("Supabase function error:", error);
    throw error;
  }
};

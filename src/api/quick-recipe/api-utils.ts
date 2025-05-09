import { supabase } from '@/integrations/supabase/client';

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  return await supabase.auth.getSession()
    .then(res => res.data.session?.access_token || '');
};

// Helper function to add delay with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Edge function invocation using Supabase client with improved resilience
export const fetchFromEdgeFunction = async (requestBody: any, signal?: AbortSignal): Promise<any> => {
  try {
    // Check if the request has been aborted already
    if (signal?.aborted) {
      console.log("Request already aborted before fetch started");
      throw new DOMException("Request aborted by user", "AbortError");
    }
    
    console.log("Using Supabase client to invoke edge function");
    
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
        
        // Check if request was aborted during the wait
        if (signal?.aborted) {
          console.log("Request aborted during backoff wait");
          throw new DOMException("Request aborted by user", "AbortError");
        }
        
        // Use Supabase client to invoke the edge function with proper headers
        const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
          body: payload,
          headers: {
            'X-Debug-Info': 'edge-function-client-' + Date.now(),
          },
        });
        
        // Check if request was aborted during the fetch
        if (signal?.aborted) {
          console.log("Request aborted during edge function invocation");
          throw new DOMException("Request aborted by user", "AbortError");
        }
        
        console.log("Edge function response received:", data ? "Data present" : "No data");
        
        // Check if there was an error from the function call
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(error.message || `Edge function returned an error`);
        }
        
        // Check if we have a valid response
        if (!data) {
          console.error("Edge function returned no data");
          throw new Error("No data returned from edge function");
        }
        
        // Return the successful response
        console.log("Edge function parsed response:", data);
        return data;
        
      } catch (fetchError: any) {
        // Check if this is an abort error
        if (fetchError.name === 'AbortError' || signal?.aborted) {
          console.log("Edge function invocation aborted by user");
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
        
        console.error("Edge function invocation error:", fetchError);
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
    console.error("Edge function invocation error:", fetchError);
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

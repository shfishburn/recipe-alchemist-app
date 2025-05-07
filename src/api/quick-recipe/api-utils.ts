
import { supabase } from '@/integrations/supabase/client';

// Functions for making API requests

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  return await supabase.auth.getSession()
    .then(res => res.data.session?.access_token || '');
};

// Direct API fetch to edge function with proper AbortController handling
export const fetchFromEdgeFunction = async (requestBody: any, timeoutMs: number = 30000): Promise<any> => {
  try {
    // Get auth token for request
    const token = await getAuthToken();
    
    // Create AbortController to handle timeouts properly
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log("Request timed out after", timeoutMs, "ms");
    }, timeoutMs);
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002'
    };
    
    // Make the direct fetch request with CORS-compatible headers
    const response = await fetch('https://zjyfumqfrtppleftpzjd.supabase.co/functions/v1/generate-quick-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Debug-Info': 'direct-fetch-production-' + Date.now(),
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    // Clear the timeout since we got a response
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || `API returned status ${response.status}`);
      } catch (e) {
        throw new Error(`API returned status ${response.status}: ${errorText.substring(0, 100)}`);
      }
    }
    
    // Parse and return the successful response
    return await response.json();
  } catch (fetchError: any) {
    console.error("Direct fetch error:", fetchError);
    
    // Handle AbortController timeout specifically
    if (fetchError.name === 'AbortError') {
      throw new Error('Recipe generation timed out. Please try with simpler ingredients.');
    }
    
    throw fetchError;
  }
};

// Fallback API call using Supabase functions
export const fetchFromSupabaseFunctions = async (requestBody: any): Promise<any> => {
  try {
    console.log("Falling back to Supabase invoke method");
    
    // Create a timeout for the invoke call
    let timeoutId: NodeJS.Timeout | null = null;
    
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error("Supabase invoke timed out after 30 seconds"));
      }, 30000);
    });
    
    // Actual function invocation
    const invokePromise = supabase.functions.invoke('generate-quick-recipe', {
      body: {
        ...requestBody,
        embeddingModel: 'text-embedding-ada-002'
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Info': 'supabase-invoke-' + Date.now()
      }
    });
    
    // Race between the invoke call and the timeout
    const result = await Promise.race([invokePromise, timeoutPromise]);
    
    // Clear timeout if we got here
    if (timeoutId) clearTimeout(timeoutId);
    
    // Process the result
    if ('error' in result && result.error) {
      console.error('Supabase functions error:', result.error);
      throw new Error(result.error.message || 'Supabase functions error');
    }

    if (!result.data) {
      throw new Error('No data returned from recipe generation');
    }

    return result.data;
  } catch (invokeError: any) {
    console.error("Supabase invoke error:", invokeError);
    throw invokeError;
  }
};

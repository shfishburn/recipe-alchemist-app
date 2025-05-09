
import { supabase } from '@/integrations/supabase/client';

// Functions for making API requests

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  return await supabase.auth.getSession()
    .then(res => res.data.session?.access_token || '');
};

// Direct API fetch to edge function
export const fetchFromEdgeFunction = async (requestBody: any, signal?: AbortSignal): Promise<any> => {
  try {
    // Get auth token for request
    const token = await getAuthToken();
    
    console.log("Testing direct fetch to edge function");
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002' // Include model in request body
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
      signal // Pass the abort signal to the fetch request
    });
    
    // Check if request was aborted
    if (signal?.aborted) {
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
  } catch (fetchError) {
    console.error("Direct fetch error:", fetchError);
    throw fetchError;
  }
};

// Fallback API call using Supabase functions
export const fetchFromSupabaseFunctions = async (requestBody: any, signal?: AbortSignal): Promise<any> => {
  // Create an AbortController that wraps the signal
  const controller = new AbortController();
  
  // If signal is provided, listen for abort events
  if (signal) {
    if (signal.aborted) {
      throw new DOMException("Request aborted by user", "AbortError");
    }
    
    signal.addEventListener('abort', () => {
      controller.abort();
    });
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
      body: {
        ...requestBody,
        embeddingModel: 'text-embedding-ada-002' // Include model in request body
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Info': 'supabase-invoke-' + Date.now()
      },
      signal: controller.signal
    });

    // Check for abort
    if (signal?.aborted) {
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
  } catch (error) {
    // Check if this is an abort error
    if (error.name === 'AbortError' || signal?.aborted) {
      throw new DOMException("Request aborted by user", "AbortError");
    }
    throw error;
  }
};


import { supabase } from '@/integrations/supabase/client';

// Functions for making API requests

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  return await supabase.auth.getSession()
    .then(res => res.data.session?.access_token || '');
};

// Direct API fetch to edge function with improved error handling
export const fetchFromEdgeFunction = async (requestBody: any): Promise<any> => {
  try {
    // Get auth token for request
    const token = await getAuthToken();
    
    console.log("Testing direct fetch to edge function");
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002' // Include model in request body
    };
    
    const origin = window.location.origin;
    console.log(`Request origin: ${origin}`);
    
    // Make the direct fetch request with enhanced CORS-compatible headers
    const response = await fetch('https://zjyfumqfrtppleftpzjd.supabase.co/functions/v1/generate-quick-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'X-Debug-Info': 'direct-fetch-production-' + Date.now(),
        'Origin': origin,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache' // Prevent caching
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit',
      // Add a longer timeout
      signal: AbortSignal.timeout(60000)
    });
    
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

// Fallback API call using Supabase functions with better error diagnostics
export const fetchFromSupabaseFunctions = async (requestBody: any): Promise<any> => {
  try {
    console.log("Attempting Supabase functions invoke after direct fetch failed");
    const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
      body: {
        ...requestBody,
        embeddingModel: 'text-embedding-ada-002', // Include model in request body
        clientTimestamp: new Date().toISOString(), // Add timestamp for debugging
        clientInfo: {
          url: window.location.href,
          origin: window.location.origin,
          userAgent: navigator.userAgent
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Info': 'supabase-invoke-' + Date.now()
      }
    });

    if (error) {
      console.error('Supabase functions error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from recipe generation');
    }

    return data;
  } catch (error) {
    console.error("Supabase functions invoke error:", error);
    throw error;
  }
};

// Try multiple methods to generate recipe with exponential backoff and detailed logging
export const generateRecipeWithRetry = async (requestBody: any, maxRetries = 2): Promise<any> => {
  let lastError: Error | null = null;
  
  // Try direct fetch first
  try {
    console.log("Attempting direct edge function fetch");
    return await fetchFromEdgeFunction(requestBody);
  } catch (error) {
    console.warn("Direct fetch failed, falling back to supabase.functions.invoke", error);
    lastError = error as Error;
  }
  
  // Then try Supabase invoke
  try {
    console.log("Attempting supabase.functions.invoke");
    return await fetchFromSupabaseFunctions(requestBody);
  } catch (error) {
    console.warn("Supabase invoke failed", error);
    lastError = error as Error;
  }
  
  // Try a different approach as a last resort - direct fetch with fetch API but no auth token
  try {
    console.log("Attempting last resort direct fetch without auth token");
    
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002',
      lastResort: true
    };
    
    const response = await fetch('https://zjyfumqfrtppleftpzjd.supabase.co/functions/v1/generate-quick-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Info': 'final-resort-fetch-' + Date.now(),
        'Origin': window.location.origin
      },
      body: JSON.stringify(payload),
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Final resort fetch failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (finalError) {
    console.error("All recipe generation methods failed", finalError);
    
    // If all methods failed, throw the last error
    if (lastError) {
      throw lastError;
    } else {
      throw new Error("All recipe generation methods failed");
    }
  }
};

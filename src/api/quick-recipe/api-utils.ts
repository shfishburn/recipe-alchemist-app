
import { supabase } from '@/integrations/supabase/client';

// Functions for making API requests

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  return await supabase.auth.getSession()
    .then(res => res.data.session?.access_token || '');
};

// Direct API fetch to edge function
export const fetchFromEdgeFunction = async (requestBody: any): Promise<any> => {
  try {
    // Get auth token for request
    const token = await getAuthToken();
    
    console.log("Starting direct fetch to edge function");
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002' // Include model in request body
    };
    
    // Log payload size without logging the entire payload
    console.log(`Request payload size: ${JSON.stringify(payload).length} bytes`);
    
    // Make the direct fetch request with CORS-compatible headers
    const response = await fetch('https://zjyfumqfrtppleftpzjd.supabase.co/functions/v1/generate-quick-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Debug-Info': 'direct-fetch-production-' + Date.now(),
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Direct fetch response status:", response.status);
    
    // Clone the response before reading it
    const responseClone = response.clone();
    const responseText = await responseClone.text();
    
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
      console.log("Direct fetch successfully parsed JSON response");
      return data;
    } catch (parseError) {
      console.error("Direct fetch response is not valid JSON:", responseText.substring(0, 100));
      throw new Error("Invalid JSON response from API");
    }
  } catch (fetchError) {
    console.error("Direct fetch error:", fetchError);
    throw fetchError;
  }
};

// Fallback API call using Supabase functions
export const fetchFromSupabaseFunctions = async (requestBody: any): Promise<any> => {
  try {
    console.log("Falling back to Supabase invoke method");
    
    const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
      body: {
        ...requestBody,
        embeddingModel: 'text-embedding-ada-002' // Include model in request body
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

    console.log("Supabase invoke returned data successfully");
    return data;
  } catch (invokeError) {
    console.error("Supabase invoke error:", invokeError);
    throw invokeError;
  }
};

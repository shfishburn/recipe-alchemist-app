
import { supabase } from '@/integrations/supabase/client';
import { callSupabaseFunction } from '@/api/supabaseFunctionClient';

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) {
    console.warn('No auth token found. User may not be logged in.');
  }
  return data.session?.access_token || '';
};

// Direct API fetch to edge function
export const fetchFromEdgeFunction = async (requestBody: any): Promise<any> => {
  try {
    // Get auth token for request
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('Authentication token is missing or empty. User may need to log in.');
    }
    
    console.log("Testing direct fetch to edge function");
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002' // Include model in request body
    };
    
    // Use our utility instead of hardcoded fetch
    const { data, error, status } = await callSupabaseFunction('generate-quick-recipe', {
      payload,
      token,
      debugTag: 'direct-fetch-production'
    });
    
    console.log("Direct fetch response status:", status);
    
    // Check for authentication errors specifically
    if (status === 401) {
      console.error("Authentication error: User not authenticated or token invalid");
      throw new Error("Authentication error: Please log in to use this feature");
    }
    
    // Check for other errors
    if (error) {
      console.error("API error details:", { error, status });
      throw new Error(`API returned error: ${error}`);
    }
    
    // No need to parse JSON, our utility already does that
    console.log("Direct fetch parsed JSON:", data);
    return data;
  } catch (fetchError: any) {
    console.error("Direct fetch error:", fetchError);
    
    // Enhanced error details
    if (fetchError.status === 401) {
      throw new Error("Authentication required: Please log in to generate recipes");
    } else if (fetchError.status === 400) {
      throw new Error("Invalid request: Please check your inputs and try again");
    } else if (fetchError.context?.response) {
      // Try to get more details from the response
      try {
        const responseText = await fetchError.context.response.text();
        console.error("Error response details:", responseText);
        const parsedError = JSON.parse(responseText);
        throw new Error(parsedError.error || fetchError.message);
      } catch (parseError) {
        // If we can't parse the response, just throw the original error
        throw fetchError;
      }
    } else {
      throw fetchError;
    }
  }
};

// Fallback API call using Supabase functions
export const fetchFromSupabaseFunctions = async (requestBody: any): Promise<any> => {
  try {
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
      
      // Check for FunctionsHttpError and try to extract more info
      if (error.name === 'FunctionsHttpError') {
        console.error('Supabase Functions error details:', {
          name: error.name,
          message: error.message,
          context: error.context || "No context"
        });
        
        // Check if we have a response object with more details
        if (error.context?.response) {
          try {
            const responseText = await error.context.response.text();
            console.error("Error response body:", responseText);
            try {
              const parsedError = JSON.parse(responseText);
              throw new Error(parsedError.error || error.message);
            } catch (parseError) {
              // If JSON parsing fails, just use the text
              throw new Error(responseText || error.message);
            }
          } catch (e) {
            // If we can't get response text, use original error
            throw error;
          }
        }
      }
      
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from recipe generation');
    }

    return data;
  } catch (error: any) {
    console.error('Supabase functions detailed error:', error);
    throw error;
  }
};

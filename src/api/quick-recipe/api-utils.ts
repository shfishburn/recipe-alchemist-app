
import { supabase } from '@/integrations/supabase/client';
import { callSupabaseFunction } from '@/api/supabaseFunctionClient';

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
    
    console.log("Testing direct fetch to edge function");
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002' // Include model in request body
    };
    
    // Use our new utility instead of hardcoded fetch
    const { data, error, status } = await callSupabaseFunction('generate-quick-recipe', {
      payload,
      token,
      debugTag: 'direct-fetch-production'
    });
    
    console.log("Direct fetch response status:", status);
    
    // Check for errors
    if (error) {
      throw new Error(`API returned error: ${error}`);
    }
    
    // No need to parse JSON, our utility already does that
    console.log("Direct fetch parsed JSON:", data);
    return data;
  } catch (fetchError) {
    console.error("Direct fetch error:", fetchError);
    throw fetchError;
  }
};

// Fallback API call using Supabase functions
export const fetchFromSupabaseFunctions = async (requestBody: any): Promise<any> => {
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

  return data;
};

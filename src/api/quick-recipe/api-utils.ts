
import { supabase } from '@/integrations/supabase/client';
import { callSupabaseFunction } from '../supabaseFunctionClient';

// Helper function to get authentication token
export const getAuthToken = async (): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) {
    console.warn('No auth token found. User may not be logged in.');
  }
  return data.session?.access_token || '';
};

// Validate payload before sending to edge function
const validateRequestPayload = (payload: any): boolean => {
  // Check if payload exists and has the required fields
  if (!payload) return false;
  
  // Check if mainIngredient is present and not empty
  if (!payload.mainIngredient || 
      (typeof payload.mainIngredient === 'string' && payload.mainIngredient.trim() === '')) {
    return false;
  }
  
  // Ensure servings is a number
  if (typeof payload.servings !== 'number') {
    payload.servings = Number(payload.servings) || 2;
  }
  
  return true;
};

// Helper function to fetch from edge function directly
export const fetchFromEdgeFunction = async (payload: any) => {
  try {
    // Build the URL properly using the Supabase project URL 
    const supabaseProjectUrl = "https://zjyfumqfrtppleftpzjd.supabase.co";
    const url = `${supabaseProjectUrl}/functions/v1/generate-quick-recipe`;
    
    console.log(`Fetching directly from edge function: ${url}`);
    
    // Validate the payload before sending
    if (!validateRequestPayload(payload)) {
      throw new Error('Invalid payload for recipe generation');
    }
    
    // Additional logging to track network requests
    const requestStartTime = Date.now();
    console.log(`[REQUEST START] ${new Date().toISOString()} - Sending request to ${url}`);
    console.log('Request payload:', JSON.stringify(payload));
    
    // Add request timeout with clear error message
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    try {
      // Get authentication token
      const token = await getAuthToken();
      
      // Call the edge function directly with timeout
      // IMPORTANT: Added credentials: 'omit' to prevent sending auth cookies/headers
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Using lowercase header name to match CORS configuration
          'x-debug-info': `direct-fetch-${Date.now()}`,
          // Add explicit Authorization header with token
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: 'omit' // Explicitly tell browser not to send credentials
      });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      const requestEndTime = Date.now();
      console.log(`[REQUEST END] ${new Date().toISOString()} - Response received in ${requestEndTime - requestStartTime}ms with status ${response.status}`);
      
      if (!response.ok) {
        // Try to extract error message from response - FIX: only try to read response once
        let errorMessage = `Edge function returned status ${response.status}`;
        
        // Create a clone of the response to safely read the body
        const responseClone = response.clone();
        
        try {
          const errorData = await responseClone.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error('[ERROR PARSING RESPONSE]', e);
          // No need to attempt a second read, just use the default error message
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log(`[RESPONSE DATA] Successfully parsed response data`);
      return data;
      
    } catch (fetchError) {
      // Clear the timeout if it was an error
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error(`[REQUEST TIMEOUT] Request to ${url} timed out after 120 seconds`);
        throw new Error('Recipe generation request timed out. Please try again.');
      }
      
      // Add specific handling for CORS errors
      if (fetchError.message && fetchError.message.includes('CORS')) {
        console.error('[CORS ERROR] Cross-origin request failed:', fetchError);
        throw new Error('Network error: Unable to connect to recipe service due to CORS restrictions. Please try again later.');
      }
      
      console.error(`[REQUEST ERROR] ${fetchError.message}`);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error calling edge function directly:', error);
    throw error;
  }
};

// Helper function to fetch from Supabase Functions
export const fetchFromSupabaseFunctions = async (payload: any, token: string) => {
  try {
    console.log(`[SUPABASE FUNCTION] Starting request with token: ${token ? "token exists" : "no token"}`);
    console.log('[SUPABASE FUNCTION] Request payload:', JSON.stringify(payload));
    const requestStartTime = Date.now();
    
    const result = await callSupabaseFunction('generate-quick-recipe', {
      payload,
      token,
      debugTag: 'fetch-from-functions'
    });
    
    const requestEndTime = Date.now();
    console.log(`[SUPABASE FUNCTION] Response received in ${requestEndTime - requestStartTime}ms with success: ${!result.error}`);
    
    if (result.error) {
      console.error('[SUPABASE FUNCTION ERROR]', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('[SUPABASE FUNCTION ERROR]', error);
    throw error;
  }
};

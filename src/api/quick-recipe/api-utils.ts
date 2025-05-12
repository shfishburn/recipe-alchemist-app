
import { supabase } from '@/integrations/supabase/client';
import { callSupabaseFunction } from '@/api/supabaseFunctionClient';

/**
 * @locked
 * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
 * Reason: Critical authentication helper that interfaces with Supabase
 * session management and token retrieval.
 */
export const getAuthToken = async (): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) {
    console.warn('No auth token found. User may not be logged in.');
  }
  return data.session?.access_token || '';
};

/**
 * @locked
 * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
 * Reason: Validation logic that ensures request payloads are properly formatted
 * before sending to edge functions.
 */
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

/**
 * @locked
 * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
 * Reason: Direct edge function fetching fallback mechanism with error handling
 * and validation. Critical for recipe generation reliability.
 */
export const fetchFromEdgeFunction = async (payload: any) => {
  try {
    // Instead of accessing the protected url property, construct the URL properly
    // Use the Supabase project URL and append the function name
    const supabaseProjectUrl = "https://zjyfumqfrtppleftpzjd.supabase.co";
    const url = `${supabaseProjectUrl}/functions/v1/generate-quick-recipe`;
    
    console.log(`Fetching directly from edge function: ${url}`);
    
    // Validate the payload before sending
    if (!validateRequestPayload(payload)) {
      throw new Error('Invalid payload for recipe generation');
    }
    
    // Call the edge function directly
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Info': `direct-fetch-${Date.now()}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      // Try to extract error message from response
      let errorMessage = `Edge function returned status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Ignore parse error and use default message
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling edge function directly:', error);
    // REMOVED: markEdgeFunctionUnavailable calls
    throw error;
  }
};

/**
 * @locked
 * DO NOT MODIFY WITHOUT APPROVAL — S. Fishburn, 2025-05-12
 * Reason: Helper function for authenticated edge function calls.
 */
export const fetchFromSupabaseFunctions = async (payload: any, token: string) => {
  return callSupabaseFunction('generate-quick-recipe', {
    payload,
    token,
    debugTag: 'fetch-from-functions'
  });
};

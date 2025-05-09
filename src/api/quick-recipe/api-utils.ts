
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

// Validate payload before sending to edge function
const validateRequestPayload = (payload: any): boolean => {
  // Check if payload exists and has the required fields
  if (!payload) return false;
  
  // Check if mainIngredient is present and not empty
  if (!payload.mainIngredient || 
      (typeof payload.mainIngredient === 'string' && payload.mainIngredient.trim() === '')) {
    console.error('Request validation failed: Missing mainIngredient');
    return false;
  }
  
  // Ensure cuisine has a valid value
  if (!payload.cuisine) {
    console.warn('Request validation: cuisine is missing, setting default');
    payload.cuisine = 'any'; // Set default value
  }
  
  // Basic validation passed
  return true;
};

// Direct API fetch to edge function
export const fetchFromEdgeFunction = async (requestBody: any): Promise<any> => {
  try {
    // Validate the request payload before proceeding
    if (!validateRequestPayload(requestBody)) {
      throw new Error('Invalid request: Please provide all required information for recipe generation');
    }
    
    // Get auth token for request
    const token = await getAuthToken();
    
    // Check if user is authenticated - NEW
    if (!token) {
      throw new Error('Authentication required: Please sign in to generate recipes');
    }
    
    console.log("Using direct fetch to edge function with payload:", {
      mainIngredient: requestBody.mainIngredient,
      cuisine: requestBody.cuisine || 'any',
      servings: requestBody.servings || 2,
      dietary: requestBody.dietary || '',
    });
    
    // Create a proper payload with embedding model in body
    const payload = {
      ...requestBody,
      embeddingModel: 'text-embedding-ada-002', // Include model in request body
      cuisine: requestBody.cuisine || 'any', // Ensure cuisine is never null/undefined
      dietary: requestBody.dietary || '', // Ensure dietary is never null/undefined
      servings: requestBody.servings || 2 // Ensure servings has a default
    };
    
    // Create an AbortController to handle timeouts properly
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
      // Use our utility instead of hardcoded fetch
      // Remove the signal property since it's not supported in SupabaseFunctionOptions
      const { data, error, status } = await callSupabaseFunction('generate-quick-recipe', {
        payload,
        token,
        debugTag: 'direct-fetch-production'
      });
      
      // Clear the timeout once the fetch completes
      clearTimeout(timeoutId);
      
      console.log("Direct fetch response status:", status);
      
      // Check for authentication errors specifically
      if (status === 401) {
        console.error("Authentication error: User not authenticated or token invalid");
        throw new Error("Authentication required: Please sign in to generate recipes");
      }
      
      // Check for other errors
      if (error) {
        console.error("API error details:", { error, status });
        throw new Error(`API returned error: ${error}`);
      }
      
      // No need to parse JSON, our utility already does that
      console.log("Direct fetch parsed JSON:", data);
      return data;
    } finally {
      // Ensure timeout is cleared in all cases
      clearTimeout(timeoutId);
    }
  } catch (fetchError: any) {
    console.error("Direct fetch error:", fetchError);
    
    // Enhanced error details
    if (fetchError.name === 'AbortError') {
      throw new Error("Recipe generation timed out. Please try again with a simpler request.");
    } else if (fetchError.status === 401) {
      throw new Error("Authentication required: Please sign in to generate recipes");
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
    // Validate the request payload before proceeding
    if (!validateRequestPayload(requestBody)) {
      throw new Error('Invalid request: Please provide all required information for recipe generation');
    }
    
    // Get auth token and check if user is authenticated - NEW
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required: Please sign in to generate recipes');
    }
    
    console.log("Falling back to Supabase functions invoke with payload:", {
      mainIngredient: requestBody.mainIngredient,
      cuisine: requestBody.cuisine || 'any',
      servings: requestBody.servings || 2,
    });
    
    // Create an AbortController for timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const { data, error } = await supabase.functions.invoke('generate-quick-recipe', {
        body: {
          ...requestBody,
          embeddingModel: 'text-embedding-ada-002', // Include model in request body
          cuisine: requestBody.cuisine || 'any', // Ensure cuisine is never null/undefined
          dietary: requestBody.dietary || '', // Ensure dietary is never null/undefined
          servings: requestBody.servings || 2 // Ensure servings has a default
        },
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Info': 'supabase-invoke-' + Date.now()
        }
      });

      // Clear the timeout once the fetch completes
      clearTimeout(timeoutId);

      if (error) {
        console.error('Supabase functions error:', error);
        
        // Check for FunctionsHttpError and try to extract more info
        if (error.name === 'FunctionsHttpError') {
          console.error('Supabase Functions error details:', {
            name: error.name,
            message: error.message,
            context: error.context || "No context"
          });
          
          if (error.message?.includes('401') || error.status === 401) {
            throw new Error('Authentication required: Please sign in to generate recipes');
          }
          
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
    } finally {
      // Ensure timeout is cleared in all cases
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    console.error('Supabase functions detailed error:', error);
    
    if (error.name === 'AbortError') {
      throw new Error("Recipe generation timed out. Please try again with a simpler request.");
    }
    throw error;
  }
};

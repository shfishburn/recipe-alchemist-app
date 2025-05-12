
import { supabase } from '@/integrations/supabase/client';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface SupabaseFunctionOptions<TInput = unknown> {
  method?: HttpMethod;
  payload?: TInput;
  token?: string;
  headers?: Record<string, string>;
  debugTag?: string;
}

interface SupabaseFunctionResponse<TOutput> {
  data: TOutput | null;
  error: string | null;
  status: number;
}

/**
 * Type-safe fetch to a Supabase Edge Function with optional payload, auth, and debugging
 * 
 * NOTE: DO NOT MODIFY THIS FUNCTION - it contains important fallback logic for the recipe generation system
 */
export async function callSupabaseFunction<TInput = unknown, TOutput = unknown>(
  functionName: string,
  options: SupabaseFunctionOptions<TInput> = {}
): Promise<SupabaseFunctionResponse<TOutput>> {
  const {
    method = 'POST',
    payload,
    token,
    headers = {},
    debugTag = 'default'
  } = options;

  try {
    console.log(`Calling Supabase function "${functionName}" with:`, {
      method,
      hasToken: !!token,
      debugTag,
      payloadKeys: payload ? Object.keys(payload) : 'no payload'
    });
    
    // Use the Supabase functions.invoke method with proper authentication
    const response = await supabase.functions.invoke<TOutput>(functionName, {
      method,
      body: payload,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Debug-Info': `${debugTag}-${Date.now()}`,
        ...headers
      }
    });

    // Handle different response types safely
    console.log(`Supabase function "${functionName}" responded:`, response);

    if (response.error) {
      return {
        data: null,
        error: response.error.message || `Error calling function: ${functionName}`,
        status: response.error.status || 500
      };
    }

    return {
      data: response.data,
      error: null,
      status: 200 // Successful responses always have 200 status
    };
  } catch (err: any) {
    console.error(`Error calling Supabase function "${functionName}"`, err);
    return {
      data: null,
      error: (err as Error)?.message || 'Unknown fetch error',
      status: 500
    };
  }
}

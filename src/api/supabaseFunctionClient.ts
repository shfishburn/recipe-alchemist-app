
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

  // Validate authentication token if present
  if (token === '') {
    console.warn('Empty authentication token provided to callSupabaseFunction');
    return {
      data: null,
      error: 'Authentication required. Please sign in to continue.',
      status: 401
    };
  }

  try {
    console.log(`Calling Supabase function "${functionName}" with:`, {
      method,
      hasToken: !!token,
      debugTag,
      payloadKeys: payload ? Object.keys(payload) : 'no payload'
    });

    // Use the Supabase functions.invoke method rather than direct fetch
    const response = await supabase.functions.invoke(functionName, {
      method,
      body: payload,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-Debug-Info': `${debugTag}-${Date.now()}`,
        ...headers
      }
    });

    // Log response status for debugging
    console.log(`Supabase function "${functionName}" responded with status:`, response.status);

    if (response.error) {
      return {
        data: null,
        error: response.error.message || `Error calling function: ${functionName}`,
        status: response.status || 500
      };
    }

    return {
      data: response.data as TOutput,
      error: null,
      status: response.status || 200
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

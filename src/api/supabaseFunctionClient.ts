
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

  // Get base URL from Supabase client
  const supabaseUrl = supabase.supabaseUrl;
  if (!supabaseUrl) {
    return {
      data: null,
      error: 'Supabase URL could not be determined',
      status: 500
    };
  }

  const baseUrl = `${supabaseUrl}/functions/v1`;
  const url = `${baseUrl}/${functionName}`;

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      'X-Debug-Info': `${debugTag}-${Date.now()}`,
      ...headers
    },
    ...(payload && { body: JSON.stringify(payload) })
  };

  try {
    const response = await fetch(url, requestOptions);
    const contentType = response.headers.get('content-type');

    let json: any = null;
    if (contentType?.includes('application/json')) {
      try {
        json = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('Error parsing JSON response:', parseError, 'Response text:', text);
        return {
          data: null,
          error: `Invalid JSON response: ${parseError?.message || 'Unknown parse error'}`,
          status: response.status
        };
      }
    } else {
      json = await response.text();
    }

    if (!response.ok) {
      return {
        data: null,
        error: typeof json === 'string' ? json : json?.error || `Error: ${response.status} ${response.statusText}`,
        status: response.status
      };
    }

    return {
      data: json as TOutput,
      error: null,
      status: response.status
    };
  } catch (err) {
    console.error(`Error calling Supabase function "${functionName}"`, err);
    return {
      data: null,
      error: (err as Error)?.message || 'Unknown fetch error',
      status: 500
    };
  }
}


import { supabase } from '@/integrations/supabase/client';

interface FunctionCallOptions<T> {
  method?: 'POST' | 'GET';
  payload?: T;
  token?: string;
  debugTag?: string;
  signal?: AbortSignal;
}

export async function callSupabaseFunction<T, R>(
  functionName: string,
  options: FunctionCallOptions<T> = {}
) {
  const { method = 'POST', payload, token, debugTag, signal } = options;
  const timestamp = Date.now();
  const debugInfo = debugTag ? `${debugTag}-${timestamp}` : `call-${timestamp}`;
  
  try {
    // Configure headers for the function call
    const headers: Record<string, string> = {
      'x-debug-info': debugInfo
    };

    // Add authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make the function call with proper abort signal handling
    // Remove the signal from the invoke options as it's not supported
    const response = await supabase.functions.invoke(functionName, {
      method,
      body: payload,
      headers,
      // signal is not supported in FunctionInvokeOptions, so we handle it differently
    });

    // Create a way to handle abort manually if needed
    if (signal && signal.aborted) {
      throw new DOMException('The operation was aborted', 'AbortError');
    }

    // Return a standardized response object
    return {
      data: response.data,
      error: response.error?.message || null,
      status: response.error ? response.error.status || 500 : 200
    };
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    
    // Check if it's an abort error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error; // Re-throw abort errors
    }
    
    // Return standardized error response
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
      status: error instanceof Error && 'status' in error ? (error as any).status : 500
    };
  }
}

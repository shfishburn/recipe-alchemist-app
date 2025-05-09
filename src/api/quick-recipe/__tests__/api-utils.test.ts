
import { fetchFromEdgeFunction, fetchFromSupabaseFunctions, getAuthToken } from '../api-utils';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'test-token'
          }
        }
      })
    },
    functions: {
      invoke: jest.fn()
    }
  }
}));

// Mock fetch
global.fetch = jest.fn();

describe('API Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('getAuthToken', () => {
    it('should return the access token from session', async () => {
      const token = await getAuthToken();
      expect(token).toBe('test-token');
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    it('should return empty string if no session', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({ data: { session: null } });
      const token = await getAuthToken();
      expect(token).toBe('');
    });
  });

  describe('fetchFromEdgeFunction', () => {
    const mockRequestBody = { cuisine: 'italian', mainIngredient: 'pasta' };
    const mockResponse = { title: 'Pasta Recipe', ingredients: [] };
    const mockResponseText = JSON.stringify(mockResponse);
    
    it('should successfully fetch data from edge function', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValueOnce(mockResponseText)
      });

      const result = await fetchFromEdgeFunction(mockRequestBody);
      expect(result).toEqual(mockResponse);
      
      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        'https://zjyfumqfrtppleftpzjd.supabase.co/functions/v1/generate-quick-recipe',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            ...mockRequestBody,
            embeddingModel: 'text-embedding-ada-002'
          })
        })
      );
    });

    it('should handle non-ok responses with error messages', async () => {
      const errorJson = JSON.stringify({ error: 'API error' });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValueOnce(errorJson)
      });

      await expect(fetchFromEdgeFunction(mockRequestBody)).rejects.toThrow('API error');
    });

    it('should handle non-JSON responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: jest.fn().mockResolvedValueOnce('Not JSON')
      });

      await expect(fetchFromEdgeFunction(mockRequestBody)).rejects.toThrow('Invalid JSON response');
    });

    it('should respect the AbortSignal', async () => {
      const abortController = new AbortController();
      abortController.abort(); // Pre-aborted

      await expect(fetchFromEdgeFunction(mockRequestBody, abortController.signal)).rejects.toThrow('AbortError');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should propagate AbortError during fetch', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));
      
      await expect(fetchFromEdgeFunction(mockRequestBody)).rejects.toThrow('AbortError');
    });
  });

  describe('fetchFromSupabaseFunctions', () => {
    const mockRequestBody = { cuisine: 'mexican', mainIngredient: 'corn' };
    const mockResponse = { data: { title: 'Corn Recipe', ingredients: [] }, error: null };
    
    it('should successfully fetch data from Supabase functions', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await fetchFromSupabaseFunctions(mockRequestBody);
      expect(result).toEqual(mockResponse.data);
      
      // Verify invoke was called correctly
      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'generate-quick-recipe',
        expect.objectContaining({
          body: expect.objectContaining({
            ...mockRequestBody,
            embeddingModel: 'text-embedding-ada-002'
          })
        })
      );
    });

    it('should handle errors from Supabase functions', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValueOnce({ 
        data: null, 
        error: { message: 'Function error' } 
      });

      await expect(fetchFromSupabaseFunctions(mockRequestBody)).rejects.toThrow('Function error');
    });

    it('should handle missing data', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValueOnce({ 
        data: null, 
        error: null
      });

      await expect(fetchFromSupabaseFunctions(mockRequestBody)).rejects.toThrow('No data returned');
    });

    it('should respect the AbortSignal', async () => {
      const abortController = new AbortController();
      abortController.abort(); // Pre-aborted

      await expect(fetchFromSupabaseFunctions(mockRequestBody, abortController.signal)).rejects.toThrow('AbortError');
      expect(supabase.functions.invoke).not.toHaveBeenCalled();
    });

    it('should handle timeouts', async () => {
      jest.useFakeTimers();
      
      // Setup a promise that won't resolve until we advance timers
      const invokePromise = new Promise(resolve => {
        setTimeout(() => resolve({ data: mockResponse, error: null }), 50000);
      });
      
      (supabase.functions.invoke as jest.Mock).mockReturnValueOnce(invokePromise);
      
      const functionPromise = fetchFromSupabaseFunctions(mockRequestBody);
      
      // Advance timers past the timeout threshold
      jest.advanceTimersByTime(45000);
      
      await expect(functionPromise).rejects.toThrow('Recipe generation timed out');
      
      jest.useRealTimers();
    });
  });
});


import { enhanceErrorMessage, processErrorResponse } from '../error-utils';

describe('Error Utils', () => {
  describe('enhanceErrorMessage', () => {
    it('should handle timeout errors', () => {
      const error = new Error('Connection timeout');
      const result = enhanceErrorMessage(error);
      expect(result).toContain('Recipe generation timed out');
    });

    it('should handle fetch errors', () => {
      const error = new Error('Failed to fetch');
      const result = enhanceErrorMessage(error);
      expect(result).toContain('Network error');
    });

    it('should handle server errors', () => {
      const error = { status: 500, message: 'Internal server error' };
      const result = enhanceErrorMessage(error);
      expect(result).toContain('Server error');
    });

    it('should handle bad request errors', () => {
      const error = { status: 400, message: 'Bad request' };
      const result = enhanceErrorMessage(error);
      expect(result).toContain('Invalid request format');
    });

    it('should handle JSON parsing errors', () => {
      const error = new SyntaxError('Unexpected token in JSON');
      const result = enhanceErrorMessage(error);
      expect(result).toContain('Error processing the recipe');
    });

    it('should handle missing API key errors', () => {
      const error = new Error('Missing OpenAI API key');
      const result = enhanceErrorMessage(error);
      expect(result).toContain('issue with our AI service configuration');
    });

    it('should handle empty request errors', () => {
      const error = new Error('Empty request body');
      const result = enhanceErrorMessage(error);
      expect(result).toContain('request couldn\'t be processed because it was empty');
    });

    it('should handle unknown errors', () => {
      const error = new Error('Something went wrong');
      const result = enhanceErrorMessage(error);
      expect(result).toBe('Something went wrong');
    });
  });

  describe('processErrorResponse', () => {
    it('should enhance error message and throw', async () => {
      const error = new Error('Connection timeout');
      
      await expect(processErrorResponse(error)).rejects.toThrow('Recipe generation timed out');
    });

    it('should handle Supabase function errors with response data', async () => {
      const mockResponseText = JSON.stringify({ error: 'Custom API error' });
      const mockResponse = {
        clone: jest.fn().mockReturnValue({
          text: jest.fn().mockResolvedValue(mockResponseText)
        }),
        status: 400
      };
      
      const error = {
        context: {
          response: mockResponse
        },
        message: 'Supabase function error'
      };
      
      await expect(processErrorResponse(error)).rejects.toThrow('Custom API error');
      expect(mockResponse.clone).toHaveBeenCalled();
    });

    it('should handle response parsing errors', async () => {
      const mockResponse = {
        clone: jest.fn().mockReturnValue({
          text: jest.fn().mockRejectedValue(new Error('Cannot read response'))
        }),
        status: 500
      };
      
      const error = {
        context: {
          response: mockResponse
        },
        message: 'Supabase function error'
      };
      
      await expect(processErrorResponse(error)).rejects.toThrow('Server error');
    });
  });
});

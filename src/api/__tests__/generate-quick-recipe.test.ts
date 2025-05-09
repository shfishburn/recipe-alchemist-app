
import { generateQuickRecipe } from '../generate-quick-recipe';
import { fetchFromEdgeFunction, fetchFromSupabaseFunctions } from '../quick-recipe/api-utils';
import { QuickRecipeFormData } from '@/types/quick-recipe';

// Mock the API utilities
jest.mock('../quick-recipe/api-utils', () => ({
  fetchFromEdgeFunction: jest.fn(),
  fetchFromSupabaseFunctions: jest.fn(),
  getAuthToken: jest.fn().mockResolvedValue('test-token')
}));

// Mock the utility functions
jest.mock('../quick-recipe/format-utils', () => ({
  formatRequestBody: jest.fn().mockImplementation(data => ({
    cuisine: data.cuisine || 'any',
    dietary: data.dietary || '',
    mainIngredient: data.mainIngredient,
    servings: data.servings || 2,
    maxCalories: data.maxCalories,
    cuisineCategory: 'Global'
  }))
}));

jest.mock('../quick-recipe/timeout-utils', () => ({
  createTimeoutPromise: jest.fn().mockImplementation(() => 
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 999999))
  )
}));

jest.mock('@/utils/recipe-normalization', () => ({
  normalizeRecipeResponse: jest.fn(data => ({ 
    ...data, 
    normalized: true 
  }))
}));

describe('Generate Quick Recipe', () => {
  const mockFormData: QuickRecipeFormData = {
    cuisine: 'italian',
    dietary: 'vegetarian',
    mainIngredient: 'pasta',
    servings: 2
  };
  
  const mockRecipeResponse = {
    title: 'Pasta Recipe',
    ingredients: [{ item: 'pasta', qty: 1, unit: 'lb' }],
    instructions: ['Cook pasta', 'Serve'],
    servings: 2
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully generate a recipe with edge function', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockResolvedValueOnce(mockRecipeResponse);
    
    const result = await generateQuickRecipe(mockFormData);
    
    expect(result).toEqual({
      ...mockRecipeResponse,
      normalized: true
    });
    
    expect(fetchFromEdgeFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        cuisine: 'italian',
        dietary: 'vegetarian',
        mainIngredient: 'pasta'
      }),
      undefined
    );
  });

  it('should pass abort signal to API functions', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockResolvedValueOnce(mockRecipeResponse);
    
    const abortController = new AbortController();
    await generateQuickRecipe(mockFormData, { signal: abortController.signal });
    
    expect(fetchFromEdgeFunction).toHaveBeenCalledWith(
      expect.any(Object),
      abortController.signal
    );
  });

  it('should fallback to supabase functions if edge function fails', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockRejectedValueOnce(new Error('Edge function failed'));
    (fetchFromSupabaseFunctions as jest.Mock).mockResolvedValueOnce(mockRecipeResponse);
    
    const result = await generateQuickRecipe(mockFormData);
    
    expect(result).toEqual({
      ...mockRecipeResponse,
      normalized: true
    });
    
    expect(fetchFromEdgeFunction).toHaveBeenCalled();
    expect(fetchFromSupabaseFunctions).toHaveBeenCalled();
  });

  it('should throw if main ingredient is missing', async () => {
    await expect(generateQuickRecipe({ ...mockFormData, mainIngredient: '' }))
      .rejects.toThrow('Please provide a main ingredient');
  });

  it('should respect an aborted signal', async () => {
    const abortController = new AbortController();
    abortController.abort();
    
    await expect(generateQuickRecipe(mockFormData, { signal: abortController.signal }))
      .rejects.toThrow('AbortError');
    
    expect(fetchFromEdgeFunction).not.toHaveBeenCalled();
  });

  it('should handle error responses from API', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockResolvedValueOnce({ error: 'API Error' });
    
    await expect(generateQuickRecipe(mockFormData)).rejects.toThrow('API Error');
  });

  it('should handle null response from API', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockResolvedValueOnce(null);
    
    await expect(generateQuickRecipe(mockFormData)).rejects.toThrow('No recipe data returned');
  });

  it('should use custom timeout if provided', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockResolvedValueOnce(mockRecipeResponse);
    
    await generateQuickRecipe(mockFormData, { timeout: 30000 });
    
    const createTimeoutPromise = require('../quick-recipe/timeout-utils').createTimeoutPromise;
    expect(createTimeoutPromise).toHaveBeenCalledWith(30000);
  });

  it('should propagate abort errors from fetch operations', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'));
    
    await expect(generateQuickRecipe(mockFormData)).rejects.toThrow('AbortError');
    expect(fetchFromSupabaseFunctions).not.toHaveBeenCalled();
  });

  it('should enhance error messages', async () => {
    (fetchFromEdgeFunction as jest.Mock).mockRejectedValueOnce(new Error('Connection timeout'));
    (fetchFromSupabaseFunctions as jest.Mock).mockRejectedValueOnce(new Error('Function error'));
    
    await expect(generateQuickRecipe(mockFormData)).rejects.toThrow('Recipe generation timed out');
  });
});

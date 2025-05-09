
import React from 'react';
import { screen } from '@testing-library/react';
import QuickRecipePage from '../../QuickRecipePage';
import { renderWithRouter, mockUseQuickRecipePage, mockQuickRecipeStore } from '../utils/test-utils';

// Mock the hooks used by the component
jest.mock('@/hooks/use-quick-recipe-page', () => ({
  useQuickRecipePage: jest.fn()
}));

jest.mock('@/hooks/use-quick-recipe', () => ({
  useQuickRecipe: jest.fn().mockImplementation(() => ({
    useQuery: {
      data: null,
      isLoading: false,
      error: null
    },
    generateQuickRecipe: jest.fn()
  }))
}));

// Mock the store to control its state in tests
jest.mock('@/store/use-quick-recipe-store');

describe('QuickRecipePage - Error States', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuickRecipeStore({});
  });

  it('should render error when error is present', () => {
    mockUseQuickRecipePage({
      recipe: null,
      isLoading: false,
      formData: { mainIngredient: 'chicken' },
      error: 'Something went wrong',
      isDirectNavigation: false,
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Test that error messages are displayed
    expect(screen.getByText(/Recipe Generation Failed/i)).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

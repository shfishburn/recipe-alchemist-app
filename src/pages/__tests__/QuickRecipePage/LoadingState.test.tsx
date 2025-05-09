
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

describe('QuickRecipePage - Loading States', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuickRecipeStore({});
  });

  it('should render loading screen when isLoading is true', () => {
    mockUseQuickRecipePage({
      isLoading: true,
      formData: { mainIngredient: 'chicken' },
      isDirectNavigation: false
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Expect the loading indicator to be rendered
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('should show retry indicator when isRetrying is true', () => {
    mockUseQuickRecipePage({
      recipe: null,
      isLoading: false,
      formData: { mainIngredient: 'chicken' },
      error: 'Something went wrong',
      hasTimeoutError: false,
      isRetrying: true,
      isDirectNavigation: false,
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // In retry mode, we show loading again, so loading-animation should be present
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });
});

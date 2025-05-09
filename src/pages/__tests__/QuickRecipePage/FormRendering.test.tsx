
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

describe('QuickRecipePage - Form Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuickRecipeStore({});
  });

  it('should render the form container when in direct navigation mode', () => {
    mockUseQuickRecipePage({
      isDirectNavigation: true
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Expect the form to be rendered with Testing Library matcher
    expect(screen.getByText(/Create Your Perfect Recipe/i)).toBeInTheDocument();
  });
});

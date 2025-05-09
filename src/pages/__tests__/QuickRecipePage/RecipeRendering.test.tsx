
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

describe('QuickRecipePage - Recipe Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuickRecipeStore({});
  });

  it('should render recipe when available', () => {
    const mockRecipe = {
      title: 'Test Recipe',
      tagline: 'A tasty test',
      ingredients: [{ item: 'test', qty: 1, unit: 'cup' }],
      instructions: ['Test step'],
      steps: ['Test step'],
      servings: 2
    };

    mockUseQuickRecipePage({
      recipe: mockRecipe,
      isLoading: false,
      formData: { mainIngredient: 'chicken' },
      isDirectNavigation: false,
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Test that the recipe title is displayed
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  it('should render empty state when no recipe and no error', () => {
    mockUseQuickRecipePage({
      recipe: null,
      isLoading: false,
      formData: null,
      error: null,
      isDirectNavigation: false,
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Test empty state rendering
    expect(screen.getByTestId('quick-recipe-empty')).toBeInTheDocument();
  });
});

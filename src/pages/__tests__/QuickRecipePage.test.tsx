
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuickRecipePage from '../QuickRecipePage';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

// Mock the hooks
jest.mock('@/hooks/use-quick-recipe-page', () => ({
  useQuickRecipePage: jest.fn().mockImplementation(() => ({
    recipe: null,
    isLoading: false,
    formData: null,
    error: null,
    hasTimeoutError: false,
    isRetrying: false,
    debugMode: false,
    isDirectNavigation: true,
    handleRetry: jest.fn(),
    handleCancel: jest.fn(),
    toggleDebugMode: jest.fn()
  }))
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

// Mock the store
jest.mock('@/store/use-quick-recipe-store');

// Create test renderer wrapper
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('QuickRecipePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Cast the mock to the correct type
    (useQuickRecipeStore as jest.Mock).mockReturnValue({
      recipe: null,
      isLoading: false,
      error: null
    });
  });

  it('should render the form container when in direct navigation mode', () => {
    const useQuickRecipePageMock = require('@/hooks/use-quick-recipe-page').useQuickRecipePage;
    useQuickRecipePageMock.mockReturnValue({
      recipe: null,
      isLoading: false,
      formData: null,
      error: null,
      hasTimeoutError: false,
      isRetrying: false,
      debugMode: false,
      isDirectNavigation: true,
      handleRetry: jest.fn(),
      handleCancel: jest.fn(),
      toggleDebugMode: jest.fn()
    });
    
    // Mock the store
    (useQuickRecipeStore as jest.Mock).mockReturnValue({
      recipe: null,
      isLoading: false,
      error: null
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Expect the form to be rendered
    expect(screen.getByText(/Create Your Perfect Recipe/i)).toBeInTheDocument();
  });

  it('should render loading screen when isLoading is true', () => {
    const useQuickRecipePageMock = require('@/hooks/use-quick-recipe-page').useQuickRecipePage;
    useQuickRecipePageMock.mockReturnValue({
      recipe: null,
      isLoading: true,
      formData: { mainIngredient: 'chicken' },
      error: null,
      hasTimeoutError: false,
      isRetrying: false,
      debugMode: false,
      isDirectNavigation: false,
      handleRetry: jest.fn(),
      handleCancel: jest.fn(),
      toggleDebugMode: jest.fn()
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Expect the loading indicator to be rendered
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
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

    const useQuickRecipePageMock = require('@/hooks/use-quick-recipe-page').useQuickRecipePage;
    useQuickRecipePageMock.mockReturnValue({
      recipe: mockRecipe,
      isLoading: false,
      formData: { mainIngredient: 'chicken' },
      error: null,
      hasTimeoutError: false,
      isRetrying: false,
      debugMode: false,
      isDirectNavigation: false,
      handleRetry: jest.fn(),
      handleCancel: jest.fn(),
      toggleDebugMode: jest.fn()
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Expect the recipe to be rendered
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  it('should render error when error is present', () => {
    const useQuickRecipePageMock = require('@/hooks/use-quick-recipe-page').useQuickRecipePage;
    useQuickRecipePageMock.mockReturnValue({
      recipe: null,
      isLoading: false,
      formData: { mainIngredient: 'chicken' },
      error: 'Something went wrong',
      hasTimeoutError: false,
      isRetrying: false,
      debugMode: false,
      isDirectNavigation: false,
      handleRetry: jest.fn(),
      handleCancel: jest.fn(),
      toggleDebugMode: jest.fn()
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Expect the error to be rendered
    expect(screen.getByText(/Recipe Generation Failed/i)).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render empty state when no recipe and no error', () => {
    const useQuickRecipePageMock = require('@/hooks/use-quick-recipe-page').useQuickRecipePage;
    useQuickRecipePageMock.mockReturnValue({
      recipe: null,
      isLoading: false,
      formData: null,
      error: null,
      hasTimeoutError: false,
      isRetrying: false,
      debugMode: false,
      isDirectNavigation: false,
      handleRetry: jest.fn(),
      handleCancel: jest.fn(),
      toggleDebugMode: jest.fn()
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // Expect the empty state to be rendered
    expect(screen.getByTestId('quick-recipe-empty')).toBeInTheDocument();
  });

  it('should show retry indicator when isRetrying is true', () => {
    const useQuickRecipePageMock = require('@/hooks/use-quick-recipe-page').useQuickRecipePage;
    useQuickRecipePageMock.mockReturnValue({
      recipe: null,
      isLoading: false,
      formData: { mainIngredient: 'chicken' },
      error: 'Something went wrong',
      hasTimeoutError: false,
      isRetrying: true,
      debugMode: false,
      isDirectNavigation: false,
      handleRetry: jest.fn(),
      handleCancel: jest.fn(),
      toggleDebugMode: jest.fn()
    });
    
    renderWithRouter(<QuickRecipePage />);
    
    // In retry mode, we show loading again, so loading-animation should be present
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });
});

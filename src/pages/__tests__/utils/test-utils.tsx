
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Test Renderer Helper
 * 
 * A utility function that wraps the component under test with necessary providers.
 * In this case, we're using BrowserRouter to provide routing context.
 */
export const renderWithRouter = (component: React.ReactNode): RenderResult => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

/**
 * Mock setup helper for useQuickRecipePage hook
 */
export const mockUseQuickRecipePage = (mockData: any) => {
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
    toggleDebugMode: jest.fn(),
    ...mockData
  });
};

/**
 * Mock setup helper for useQuickRecipeStore
 */
export const mockQuickRecipeStore = (mockData: any) => {
  const useQuickRecipeStore = require('@/store/use-quick-recipe-store');
  (useQuickRecipeStore.default as unknown as jest.Mock).mockReturnValue({
    recipe: null,
    isLoading: false,
    error: null,
    ...mockData
  });
};

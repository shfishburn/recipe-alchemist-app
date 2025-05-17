
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecipeActionButtons } from '../RecipeActionButtons';
import { vi, expect, describe, it, beforeEach, Mock } from 'vitest';
import { toast } from '@/hooks/use-toast';
import type { QuickRecipe } from '@/types/quick-recipe';

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

// Mock navigator APIs
Object.assign(navigator, { 
  clipboard: { 
    writeText: vi.fn(() => Promise.resolve()) 
  },
  share: vi.fn(() => Promise.resolve())
});

// Test recipe data
const testRecipe: QuickRecipe = {
  id: 'test-id',
  title: 'Test Recipe',
  description: 'Test description',
  ingredients: [
    { 
      qty_metric: 1, 
      unit_metric: 'cup', 
      qty_imperial: 1, 
      unit_imperial: 'cup', 
      item: 'sugar' 
    }
  ],
  instructions: ['Step 1', 'Step 2'],
  servings: 4
};

describe('RecipeActionButtons', () => {
  let mockOnSave: Mock;
  
  beforeEach(() => {
    mockOnSave = vi.fn();
    vi.clearAllMocks();
  });

  it('renders all action buttons', () => {
    render(
      <RecipeActionButtons 
        recipe={testRecipe}
      />
    );
    
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
  
  it('calls onSave when save button is clicked', () => {
    render(
      <RecipeActionButtons 
        recipe={testRecipe}
        onSave={mockOnSave}
      />
    );
    
    // Find save button (first button)
    const saveButton = screen.getAllByRole('button')[0];
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith(testRecipe);
  });
  
  it('shows check icon when save is successful', () => {
    render(
      <RecipeActionButtons 
        recipe={testRecipe}
        onSave={mockOnSave}
        saveSuccess={true}
      />
    );
    
    expect(screen.getByTestId('check')).toBeInTheDocument();
  });

  it('shows loading state when saving', () => {
    render(
      <RecipeActionButtons 
        recipe={testRecipe}
        onSave={mockOnSave}
        isSaving={true}
      />
    );
    
    // First button should be disabled while saving
    const saveButton = screen.getAllByRole('button')[0];
    expect(saveButton).toBeDisabled();
  });
  
  it('copies recipe text to clipboard when copy option is clicked', async () => {
    render(
      <RecipeActionButtons 
        recipe={testRecipe}
      />
    );
    
    // Open dropdown menu
    const moreButton = screen.getAllByRole('button')[3];
    fireEvent.click(moreButton);
    
    // Click copy option
    const copyButton = await screen.findByText(/copy recipe text/i);
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining('Recipe copied')
      })
    );
  });
  
  it('resets save success state after timeout', async () => {
    const onResetSaveSuccess = vi.fn();
    
    render(
      <RecipeActionButtons 
        recipe={testRecipe}
        onSave={mockOnSave}
        saveSuccess={true}
        onResetSaveSuccess={onResetSaveSuccess}
      />
    );
    
    // Wait for the reset timeout
    await waitFor(() => {
      expect(onResetSaveSuccess).toHaveBeenCalled();
    }, { timeout: 2500 });
  });
});

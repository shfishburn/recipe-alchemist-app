
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecipeActionButtons } from '../RecipeActionButtons';
import { Recipe } from '@/types/quick-recipe';
import '@testing-library/jest-dom';

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('RecipeActionButtons', () => {
  const mockRecipe: Recipe = {
    title: 'Test Recipe',
    ingredients: [{ item: 'Test Ingredient', qty: 1, unit: 'cup' }],
    instructions: ['Step 1', 'Step 2'],
    servings: 2
  };
  
  const mockOnSave = jest.fn().mockResolvedValue(undefined);
  const mockResetSaveSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the save button in default state', () => {
    render(
      <RecipeActionButtons 
        recipe={mockRecipe} 
        onSave={mockOnSave}
      />
    );
    
    expect(screen.getByText('Save Recipe')).toBeInTheDocument();
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });
  
  it('renders the saved state when saveSuccess is true', () => {
    render(
      <RecipeActionButtons 
        recipe={mockRecipe} 
        onSave={mockOnSave}
        saveSuccess={true}
      />
    );
    
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.queryByText('Save Recipe')).not.toBeInTheDocument();
  });
  
  it('disables the button when isSaving is true', () => {
    render(
      <RecipeActionButtons 
        recipe={mockRecipe} 
        onSave={mockOnSave}
        isSaving={true}
      />
    );
    
    const saveButton = screen.getByText('Saving...');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton.closest('button')).toBeDisabled();
  });
  
  it('calls onSave when the save button is clicked', async () => {
    render(
      <RecipeActionButtons 
        recipe={mockRecipe} 
        onSave={mockOnSave}
      />
    );
    
    fireEvent.click(screen.getByText('Save Recipe'));
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });
  
  it('resets saveSuccess when trying to save again', async () => {
    render(
      <RecipeActionButtons 
        recipe={mockRecipe} 
        onSave={mockOnSave}
        saveSuccess={true}
        onResetSaveSuccess={mockResetSaveSuccess}
      />
    );
    
    fireEvent.click(screen.getByText('Saved'));
    
    await waitFor(() => {
      expect(mockResetSaveSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });
});

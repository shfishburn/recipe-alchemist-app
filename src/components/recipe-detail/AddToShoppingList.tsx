
import React from 'react';
import { EnhancedAddToList } from './shopping-list/EnhancedAddToList';
import type { Recipe } from '@/types/recipe';

// This component is now deprecated and should not be used directly
// Use RecipeActions component instead which includes shopping list functionality
// This is kept for backwards compatibility
interface AddToShoppingListProps {
  recipe: Recipe;
}

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  console.warn('AddToShoppingList component is deprecated. Use RecipeActions instead.');
  return (
    <div className="touch-feedback-optimized">
      <EnhancedAddToList recipe={recipe} />
    </div>
  );
}

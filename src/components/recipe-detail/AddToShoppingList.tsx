
import React from 'react';
import { EnhancedAddToList } from './shopping-list/EnhancedAddToList';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListProps {
  recipe: Recipe;
}

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  return (
    <div className="touch-feedback-optimized">
      <EnhancedAddToList recipe={recipe} />
    </div>
  );
}

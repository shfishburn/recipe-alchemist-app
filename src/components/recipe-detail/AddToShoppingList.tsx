
import React from 'react';
import { EnhancedAddToList } from './shopping-list/EnhancedAddToList';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListProps {
  recipe: Recipe;
}

// This component now properly forwards to EnhancedAddToList without UI duplication
export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  return <EnhancedAddToList recipe={recipe} />;
}

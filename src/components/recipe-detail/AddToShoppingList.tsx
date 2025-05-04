
import React from 'react';
import { EnhancedAddToList } from './shopping-list/EnhancedAddToList';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListProps {
  recipe: Recipe;
}

// This component is deprecated - using RecipeActions is recommended instead
export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  console.warn("AddToShoppingList component is deprecated. Use RecipeActions instead.");
  return <EnhancedAddToList recipe={recipe} />;
}


import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCreateShoppingList } from '@/hooks/use-create-shopping-list';
import { useUpdateShoppingList } from '@/hooks/use-update-shopping-list';
import { useLegacyShoppingList } from '@/hooks/use-legacy-shopping-list';
import type { Recipe } from '@/types/recipe';

export function useShoppingListActions(recipe: any = null) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { createNewList, isLoading: isCreatingList } = useCreateShoppingList();
  const { addToExistingList, toggleItemChecked, isLoading: isUpdatingList } = useUpdateShoppingList();
  const { addIngredientsToShoppingList, isAddingToList } = useLegacyShoppingList();
  
  // Check loading state from all hooks
  const combinedLoading = isCreatingList || isUpdatingList || isAddingToList || isLoading;
  
  return {
    addIngredientsToShoppingList,
    toggleItemChecked,
    isAddingToList,
    createNewList: (listName: string) => createNewList(listName, recipe),
    addToExistingList: (listId: string) => addToExistingList(listId, recipe),
    isLoading: combinedLoading,
  };
}

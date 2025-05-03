
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useCreateShoppingList } from '@/hooks/use-create-shopping-list';
import { useUpdateShoppingList } from '@/hooks/use-update-shopping-list';
import { useLegacyShoppingList } from '@/hooks/use-legacy-shopping-list';
import { useToast } from '@/hooks/use-toast';
import { useShoppingListSettings } from '@/hooks/use-shopping-list-settings';
import type { Recipe } from '@/types/recipe';

export function useShoppingListActions(recipe: any = null) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { usePackageSizes } = useShoppingListSettings();
  
  const { createNewList, isLoading: isCreatingList } = useCreateShoppingList();
  const { addToExistingList, toggleItemChecked, isLoading: isUpdatingList } = useUpdateShoppingList();
  const { addIngredientsToShoppingList, isAddingToList } = useLegacyShoppingList();
  
  // Enhanced createNewList with proper navigation
  const handleCreateNewList = async (listName: string, usePackageSizesOverride?: boolean) => {
    try {
      setIsLoading(true);
      // Use the override value if provided, otherwise use the setting from useShoppingListSettings
      const usePackageSizesValue = usePackageSizesOverride !== undefined 
        ? usePackageSizesOverride 
        : usePackageSizes;
      
      const result = await createNewList(listName, recipe, usePackageSizesValue);
      
      if (result.success && result.listId) {
        toast({
          title: "Success",
          description: `Created new shopping list "${listName}" with recipe items`
        });
        
        // Navigate to the shopping lists page
        navigate('/shopping-lists');
        
        // Allow time for navigation and data loading before selecting the list
        setTimeout(() => {
          navigate(`/shopping-lists/${result.listId}`);
        }, 100);
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enhanced addToExistingList with proper navigation
  const handleAddToExistingList = async (listId: string) => {
    try {
      setIsLoading(true);
      const result = await addToExistingList(listId, recipe, usePackageSizes);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Items added to shopping list"
        });
        
        // Navigate to the shopping lists page with the ID
        navigate('/shopping-lists');
        
        // Allow time for navigation and data loading before selecting the list
        setTimeout(() => {
          navigate(`/shopping-lists/${listId}`);
        }, 100);
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check loading state from all hooks
  const combinedLoading = isCreatingList || isUpdatingList || isAddingToList || isLoading;
  
  return {
    addIngredientsToShoppingList,
    toggleItemChecked,
    isAddingToList,
    createNewList: handleCreateNewList,
    addToExistingList: handleAddToExistingList,
    isLoading: combinedLoading,
    usePackageSizes,
  };
}


import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useShoppingLists } from './useShoppingLists';
import { useRecipeToShoppingList } from '@/hooks/use-recipe-to-shopping-list';
import { toast } from '@/hooks/use-toast';
import type { Recipe } from '@/hooks/use-recipe-detail';

export function useAddToShoppingList(recipe: Recipe) {
  const { user } = useAuth();
  const [newListName, setNewListName] = useState(`${recipe.title} Ingredients`);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [addedListId, setAddedListId] = useState<string | null>(null);
  const { shoppingLists, isFetching, fetchShoppingLists } = useShoppingLists();
  const { 
    addRecipeToNewList, 
    addRecipeToExistingList, 
    isLoading 
  } = useRecipeToShoppingList();
  
  // Memoize fetch shopping lists to prevent unnecessary re-renders
  const fetchLists = useCallback(async () => {
    if (user) {
      await fetchShoppingLists();
    }
  }, [fetchShoppingLists, user]);
  
  // Fetch shopping lists when sheet opens
  useEffect(() => {
    if (sheetOpen) {
      fetchLists();
    }
  }, [sheetOpen, fetchLists]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to a shopping list.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form before proceeding
    if (!selectedListId && newListName.trim() === '') {
      toast({
        title: "Invalid form",
        description: "Please select a list or enter a name for a new list.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      let success = false;
      let listId = selectedListId;
      
      if (selectedListId) {
        const result = await addRecipeToExistingList(selectedListId, recipe);
        success = result.success;
      } else {
        const result = await addRecipeToNewList(newListName, recipe);
        success = result.success;
        if (success && result.listId) {
          listId = result.listId;
        }
      }
      
      // Only show success dialog if operation succeeded
      if (success) {
        setAddedListId(listId);
        setSheetOpen(false);
        
        // Show success dialog with navigation options
        setTimeout(() => {
          setSuccessDialogOpen(true);
        }, 300);
        
        // Reset form state
        setSelectedListId(null);
        setNewListName(`${recipe.title} Ingredients`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    // Prevent closing the sheet if loading is in progress
    if (isLoading && !open) return;
    
    setSheetOpen(open);
    
    // Reset state when closing the sheet
    if (!open) {
      setSelectedListId(null);
      setNewListName(`${recipe.title} Ingredients`);
    }
  };
  
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to a shopping list.",
        variant: "destructive",
      });
    }
  };
  
  return {
    newListName,
    setNewListName,
    selectedListId,
    setSelectedListId,
    sheetOpen,
    handleSheetOpenChange,
    successDialogOpen,
    setSuccessDialogOpen,
    shoppingLists,
    isFetching,
    handleSubmit,
    handleTriggerClick,
    isLoading,
    addedListId
  };
}

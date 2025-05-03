
import React from 'react';
import type { Recipe } from '@/hooks/use-recipe-detail';
import { useAddToShoppingList } from './shopping-list/useAddToShoppingList';
import { AddToListSheet } from './shopping-list/AddToListSheet';
import { AddSuccessDialog } from './shopping-list/AddSuccessDialog';

interface AddToShoppingListProps {
  recipe: Recipe;
}

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  const {
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
    isLoading
  } = useAddToShoppingList(recipe);
  
  return (
    <div className="relative">
      <AddToListSheet 
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        isLoading={isLoading}
        recipeTitle={recipe.title}
        newListName={newListName}
        onNewListNameChange={setNewListName}
        selectedListId={selectedListId}
        onSelectedListChange={setSelectedListId}
        shoppingLists={shoppingLists}
        isFetching={isFetching}
        onSubmit={handleSubmit}
        onTriggerClick={handleTriggerClick}
      />
      
      <AddSuccessDialog 
        open={successDialogOpen} 
        setOpen={setSuccessDialogOpen}
        recipeTitle={recipe.title}
      />
    </div>
  );
}

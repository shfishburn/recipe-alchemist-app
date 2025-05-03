
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShoppingLists } from './useShoppingLists';
import { useShoppingListActions } from './useShoppingListActions';
import { ExistingListForm } from './ExistingListForm';
import { NewListForm } from './NewListForm';
import { ShoppingListSettings } from '@/components/shopping-list/ShoppingListSettings';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListDialogProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToShoppingListDialog({ recipe, open, onOpenChange }: AddToShoppingListDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('new');
  const { shoppingLists, isFetching, fetchShoppingLists } = useShoppingLists();
  const { createNewList, addToExistingList, isLoading } = useShoppingListActions(recipe);
  
  // Fetch shopping lists when dialog opens
  useEffect(() => {
    if (open) {
      fetchShoppingLists();
    }
  }, [open, fetchShoppingLists]);
  
  const handleCreateNewList = async (name: string) => {
    const result = await createNewList(name);
    if (result.success) {
      onOpenChange(false);
    }
  };
  
  const handleAddToExistingList = async (listId: string) => {
    const result = await addToExistingList(listId);
    if (result.success) {
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Shopping List</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <ShoppingListSettings />
        </div>
        
        <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New List</TabsTrigger>
            <TabsTrigger value="existing">Existing Lists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="mt-4 space-y-4">
            <NewListForm 
              recipe={recipe}
              onSubmit={handleCreateNewList}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="existing" className="mt-4 space-y-4">
            <ExistingListForm 
              shoppingLists={shoppingLists}
              isFetching={isFetching}
              onSubmit={handleAddToExistingList}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

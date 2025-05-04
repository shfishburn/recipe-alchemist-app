
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShoppingLists } from './useShoppingLists';
import { useShoppingListActions } from './useShoppingListActions';
import { ExistingListForm } from './ExistingListForm';
import { NewListForm } from './NewListForm';
import { ShoppingListSettings } from '@/components/shopping-list/ShoppingListSettings';
import { Separator } from '@/components/ui/separator';
import type { Recipe } from '@/types/recipe';

interface AddToShoppingListDialogProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToShoppingListDialog({ recipe, open, onOpenChange }: AddToShoppingListDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('new');
  const { shoppingLists, isFetching, fetchShoppingLists } = useShoppingLists();
  const { createNewList, addToExistingList, isLoading, usePackageSizes } = useShoppingListActions(recipe);
  
  // For local override of package size optimization
  const [localUsePackageSizes, setLocalUsePackageSizes] = useState(usePackageSizes);
  
  // Update local state when global setting changes
  useEffect(() => {
    setLocalUsePackageSizes(usePackageSizes);
  }, [usePackageSizes]);
  
  // Fetch shopping lists when dialog opens
  useEffect(() => {
    if (open) {
      fetchShoppingLists();
    }
  }, [open, fetchShoppingLists]);
  
  const handleCreateNewList = async (name: string) => {
    const result = await createNewList(name, localUsePackageSizes);
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
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl">Add to Shopping List</DialogTitle>
        </DialogHeader>
        
        <div className="py-3">
          <ShoppingListSettings />
        </div>
        
        <Separator className="my-3" />
        
        <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="new">New List</TabsTrigger>
            <TabsTrigger value="existing">Existing Lists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="space-y-4 pt-2">
            <NewListForm 
              recipe={recipe}
              onSubmit={handleCreateNewList}
              isLoading={isLoading}
              usePackageSizes={localUsePackageSizes}
              setUsePackageSizes={setLocalUsePackageSizes}
            />
          </TabsContent>
          
          <TabsContent value="existing" className="space-y-4 pt-2">
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

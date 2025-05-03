import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingListSettings } from '@/components/shopping-list/ShoppingListSettings';
import { NewListForm } from './NewListForm';
import { ExistingListForm } from './ExistingListForm';
import type { ShoppingListSummary } from '@/types/shopping-list';

interface AddToListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  recipeTitle: string;
  newListName: string;
  onNewListNameChange: (name: string) => void;
  selectedListId: string;
  onSelectedListChange: (id: string) => void;
  shoppingLists: ShoppingListSummary[];
  isFetching: boolean;
  onSubmit: () => void;
  onTriggerClick: () => void;
}

export function AddToListSheet({
  open,
  onOpenChange,
  isLoading,
  recipeTitle,
  newListName,
  onNewListNameChange,
  selectedListId,
  onSelectedListChange,
  shoppingLists,
  isFetching,
  onSubmit,
  onTriggerClick
}: AddToListSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90vw] sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add to Shopping List</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 mb-6">
          <ShoppingListSettings />
        </div>
        
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New List</TabsTrigger>
            <TabsTrigger value="existing">Existing Lists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="mt-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Create a new shopping list for <strong>{recipeTitle}</strong>
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
              <div className="space-y-4">
                {/* Form fields here */}
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="existing" className="mt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Select an existing shopping list to add these ingredients to:
              </p>
            </div>
            <div className="mt-4">
              {/* Existing list selection */}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

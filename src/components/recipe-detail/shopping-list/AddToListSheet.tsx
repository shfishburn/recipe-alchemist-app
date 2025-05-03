import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingListSettings } from '@/components/shopping-list/ShoppingListSettings';
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
          
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

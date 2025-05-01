
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ButtonWrapper } from '@/components/ui/button-wrapper';
import { ShoppingBag } from 'lucide-react';
import { ShoppingListForm } from './ShoppingListForm';
import type { ShoppingListSummary } from '@/types/shopping-list';

interface AddToListSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  recipeTitle: string;
  newListName: string;
  onNewListNameChange: (name: string) => void;
  selectedListId: string | null;
  onSelectedListChange: (id: string | null) => void;
  shoppingLists: ShoppingListSummary[];
  isFetching: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onTriggerClick: (e: React.MouseEvent) => void;
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
      <SheetTrigger asChild>
        <ButtonWrapper 
          variant="outline" 
          size="sm"
          className="w-full text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200 transition-all duration-300"
          onClick={onTriggerClick}
          asChild
        >
          <button>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to shopping list
          </button>
        </ButtonWrapper>
      </SheetTrigger>
      <SheetContent className="z-[60]">
        <SheetHeader>
          <SheetTitle>Add to Shopping List</SheetTitle>
          <SheetDescription>
            Add all ingredients from "{recipeTitle}" to a shopping list.
          </SheetDescription>
        </SheetHeader>
        
        <div className="my-6">
          <ShoppingListForm 
            shoppingLists={shoppingLists}
            newListName={newListName}
            onNewListNameChange={onNewListNameChange}
            selectedListId={selectedListId}
            onSelectedListChange={onSelectedListChange}
            isLoading={isLoading || isFetching}
            onSubmit={onSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

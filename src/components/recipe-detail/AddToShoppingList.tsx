
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Recipe } from '@/hooks/use-recipe-detail';
import { useShoppingLists } from './shopping-list/useShoppingLists';
import { useShoppingListActions } from './shopping-list/useShoppingListActions';
import { ShoppingListForm } from './shopping-list/ShoppingListForm';

interface AddToShoppingListProps {
  recipe: Recipe;
}

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  const [newListName, setNewListName] = useState(`${recipe.title} Ingredients`);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { shoppingLists, isFetching, fetchShoppingLists } = useShoppingLists();
  const { isLoading, createNewList, addToExistingList } = useShoppingListActions(recipe);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedListId) {
      await addToExistingList(selectedListId);
    } else {
      await createNewList(newListName);
    }
  };
  
  return (
    <Sheet onOpenChange={(open) => open && fetchShoppingLists()}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted hover:text-foreground">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to shopping list
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add to Shopping List</SheetTitle>
          <SheetDescription>
            Add all ingredients from "{recipe.title}" to a shopping list.
          </SheetDescription>
        </SheetHeader>
        
        <div className="my-6">
          <ShoppingListForm 
            shoppingLists={shoppingLists}
            newListName={newListName}
            onNewListNameChange={setNewListName}
            selectedListId={selectedListId}
            onSelectedListChange={setSelectedListId}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

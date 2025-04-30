
import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const { shoppingLists, isFetching, fetchShoppingLists } = useShoppingLists();
  const { isLoading, createNewList, addToExistingList } = useShoppingListActions(recipe);
  
  useEffect(() => {
    if (sheetOpen) {
      fetchShoppingLists();
    }
  }, [sheetOpen, fetchShoppingLists]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedListId) {
        await addToExistingList(selectedListId);
      } else {
        await createNewList(newListName);
      }
      // Close the sheet on success
      setSheetOpen(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // Sheet stays open if there's an error
    }
  };
  
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
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
          <form onSubmit={handleSubmit}>
            <ShoppingListForm 
              shoppingLists={shoppingLists}
              newListName={newListName}
              onNewListNameChange={setNewListName}
              selectedListId={selectedListId}
              onSelectedListChange={setSelectedListId}
              isLoading={isLoading || isFetching}
            />
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

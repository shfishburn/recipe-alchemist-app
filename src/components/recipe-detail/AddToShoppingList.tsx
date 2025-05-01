
import React, { useState, useEffect, useCallback } from 'react';
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
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface AddToShoppingListProps {
  recipe: Recipe;
}

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  const { user } = useAuth();
  const [newListName, setNewListName] = useState(`${recipe.title} Ingredients`);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { shoppingLists, isFetching, fetchShoppingLists } = useShoppingLists();
  const { 
    createNewList, 
    addToExistingList, 
    isLoading 
  } = useShoppingListActions(recipe);
  
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
      
      if (selectedListId) {
        success = await addToExistingList(selectedListId);
      } else {
        success = await createNewList(newListName);
      }
      
      // Only close the sheet on success
      if (success) {
        // Add a small delay to prevent UI flashing
        setTimeout(() => {
          setSheetOpen(false);
          
          // Reset form state
          setSelectedListId(null);
          setNewListName(`${recipe.title} Ingredients`);
        }, 300);
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
  
  return (
    <div className="relative">
      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200 transition-all duration-300"
            onClick={handleTriggerClick}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to shopping list
          </Button>
        </SheetTrigger>
        <SheetContent className="z-[60]">
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
              isLoading={isLoading || isFetching}
              onSubmit={handleSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

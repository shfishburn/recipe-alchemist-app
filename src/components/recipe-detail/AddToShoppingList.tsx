
import React, { useState } from 'react';
import { Plus, ShoppingBag, Loader2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe, Ingredient } from '@/hooks/use-recipe-detail';
import type { Json } from '@/integrations/supabase/types';

interface AddToShoppingListProps {
  recipe: Recipe;
}

type ShoppingList = {
  id: string;
  title: string;
};

export function AddToShoppingList({ recipe }: AddToShoppingListProps) {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState(`${recipe.title} Ingredients`);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch user's shopping lists when sheet opens
  const handleSheetOpen = async () => {
    try {
      setIsFetching(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add items to a shopping list.",
          variant: "destructive",
        });
        return;
      }
      
      const { data: lists, error } = await supabase
        .from('shopping_lists')
        .select('id, title')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setShoppingLists(lists || []);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your shopping lists.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };
  
  // Create a new shopping list
  const createNewList = async () => {
    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("User not authenticated");
      }
      
      const ingredientItems = recipe.ingredients.map(ing => ({
        name: ing.item,
        quantity: ing.qty,
        unit: ing.unit,
        checked: false,
        recipeId: recipe.id
      }));
      
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          title: newListName,
          user_id: userData.user.id,
          items: ingredientItems as unknown as Json
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Created shopping list "${newListName}" with recipe ingredients.`,
      });
      
      return data;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to create shopping list.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add ingredients to existing list
  const addToExistingList = async () => {
    if (!selectedListId) return;
    
    try {
      setIsLoading(true);
      
      // Get current list items
      const { data: currentList, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('items')
        .eq('id', selectedListId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Prepare new items for adding
      const newItems = recipe.ingredients.map(ing => ({
        name: ing.item,
        quantity: ing.qty,
        unit: ing.unit,
        checked: false,
        recipeId: recipe.id
      }));
      
      // Combine existing and new items
      const currentItems = currentList.items as any[] || [];
      const combinedItems = [...currentItems, ...newItems];
      
      // Update the shopping list
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update({ items: combinedItems })
        .eq('id', selectedListId);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Success",
        description: `Added ingredients to shopping list.`,
      });
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      toast({
        title: "Error",
        description: "Failed to add ingredients to shopping list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedListId) {
      await addToExistingList();
    } else {
      await createNewList();
    }
  };
  
  return (
    <Sheet onOpenChange={(open) => open && handleSheetOpen()}>
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
          {isFetching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {shoppingLists.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Select existing list:</h3>
                  <div className="grid gap-2">
                    {shoppingLists.map((list) => (
                      <Button 
                        key={list.id}
                        type="button"
                        variant={selectedListId === list.id ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedListId(list.id === selectedListId ? null : list.id)}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {list.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Or create a new list:</h3>
                <Input 
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Shopping list name"
                  disabled={!!selectedListId || isLoading}
                />
              </div>
              
              <SheetFooter>
                <Button 
                  type="submit" 
                  disabled={isLoading || (shoppingLists.length > 0 && !selectedListId && newListName.trim() === '')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {selectedListId ? 'Add to Selected List' : 'Create New List'}
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

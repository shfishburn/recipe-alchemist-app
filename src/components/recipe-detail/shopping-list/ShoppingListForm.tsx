
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Loader2, Plus } from 'lucide-react';
import type { ShoppingList } from '@/types/shopping-list';

interface ShoppingListFormProps {
  shoppingLists: ShoppingList[];
  newListName: string;
  onNewListNameChange: (value: string) => void;
  selectedListId: string | null;
  onSelectedListChange: (id: string | null) => void;
  isLoading: boolean;
}

export function ShoppingListForm({
  shoppingLists,
  newListName,
  onNewListNameChange,
  selectedListId,
  onSelectedListChange,
  isLoading,
}: ShoppingListFormProps) {
  return (
    <form className="space-y-4">
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
                onClick={() => onSelectedListChange(list.id === selectedListId ? null : list.id)}
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
          onChange={(e) => onNewListNameChange(e.target.value)}
          placeholder="Shopping list name"
          disabled={!!selectedListId || isLoading}
        />
      </div>
      
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
    </form>
  );
}

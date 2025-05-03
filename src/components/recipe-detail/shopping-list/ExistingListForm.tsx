
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { ShoppingListSummary } from '@/types/shopping-list';

interface ExistingListFormProps {
  shoppingLists: ShoppingListSummary[];
  isFetching: boolean;
  onSubmit: (listId: string) => Promise<any>;
  isLoading: boolean;
}

export function ExistingListForm({ 
  shoppingLists, 
  isFetching, 
  onSubmit,
  isLoading 
}: ExistingListFormProps) {
  const [selectedListId, setSelectedListId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedListId) {
      onSubmit(selectedListId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Select 
          value={selectedListId} 
          onValueChange={setSelectedListId}
          disabled={isFetching || isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a shopping list" />
          </SelectTrigger>
          <SelectContent>
            {isFetching ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : shoppingLists.length > 0 ? (
              shoppingLists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  {list.title}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                No shopping lists found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        disabled={!selectedListId || isLoading || isFetching} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add to List'
        )}
      </Button>
    </form>
  );
}

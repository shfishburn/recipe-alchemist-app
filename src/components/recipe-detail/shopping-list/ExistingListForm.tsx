
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Select 
          value={selectedListId} 
          onValueChange={setSelectedListId}
          disabled={isFetching || isLoading}
        >
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue placeholder="Select a shopping list" />
          </SelectTrigger>
          <SelectContent>
            {isFetching ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : shoppingLists.length > 0 ? (
              shoppingLists.map((list) => (
                <SelectItem key={list.id} value={list.id} className="py-3">
                  {list.title}
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No shopping lists found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        disabled={!selectedListId || isLoading || isFetching} 
        className="w-full h-12 text-base bg-recipe-blue hover:bg-recipe-blue/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adding to List...
          </>
        ) : (
          'Add to List'
        )}
      </Button>
    </form>
  );
}

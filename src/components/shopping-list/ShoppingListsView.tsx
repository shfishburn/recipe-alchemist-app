
import React from 'react';
import { Search, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingListCard } from '@/components/shopping-list/ShoppingListCard';
import { NewListForm } from '@/components/shopping-list/NewListForm';
import type { ShoppingList } from '@/types/shopping-list';

interface ShoppingListsViewProps {
  isLoading: boolean;
  lists: ShoppingList[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  newListTitle: string;
  onNewListTitleChange: (value: string) => void;
  onCreateList: () => void;
  onSelectList: (list: ShoppingList) => void;
  onDeleteList: (id: string) => Promise<void>;
}

export function ShoppingListsView({
  isLoading,
  lists,
  searchTerm,
  onSearchChange,
  newListTitle,
  onNewListTitleChange,
  onCreateList,
  onSelectList,
  onDeleteList
}: ShoppingListsViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <NewListForm 
            newListTitle={newListTitle} 
            onNewListTitleChange={onNewListTitleChange}
            onCreateList={onCreateList}
          />
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lists"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !lists.length ? (
        <div className="text-center py-10 bg-muted/20 rounded-lg">
          <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">
            {searchTerm.trim() ? "No matching shopping lists found" : "No shopping lists yet"}
          </p>
          {searchTerm.trim() && (
            <Button variant="link" onClick={() => onSearchChange('')}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {lists.map((list) => (
            <ShoppingListCard 
              key={list.id}
              list={list}
              onClick={() => onSelectList(list)}
              onDelete={onDeleteList}
            />
          ))}
        </div>
      )}
    </div>
  );
}

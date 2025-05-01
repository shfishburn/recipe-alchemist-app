
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Loader2, Plus } from 'lucide-react';
import type { ShoppingListSummary } from '@/types/shopping-list';

interface ShoppingListFormProps {
  shoppingLists: ShoppingListSummary[];
  newListName: string;
  onNewListNameChange: (value: string) => void;
  selectedListId: string | null;
  onSelectedListChange: (id: string | null) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ShoppingListForm({
  shoppingLists,
  newListName,
  onNewListNameChange,
  selectedListId,
  onSelectedListChange,
  isLoading,
  onSubmit,
}: ShoppingListFormProps) {
  // Use local state for debouncing loading indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Effect for debounced loading state
  useEffect(() => {
    if (!isLoading && isSubmitting) {
      // Add small delay before removing loading state
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, 300);
      return () => clearTimeout(timer);
    } else if (isLoading && !isSubmitting) {
      setIsSubmitting(true);
    }
  }, [isLoading, isSubmitting]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(e);
  };
  
  const formDisabled = isSubmitting;
  const buttonDisabled = isSubmitting || (shoppingLists.length > 0 && !selectedListId && newListName.trim() === '');
  
  return (
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
                className="justify-start transition-all duration-300"
                onClick={() => onSelectedListChange(list.id === selectedListId ? null : list.id)}
                disabled={formDisabled}
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
          disabled={!!selectedListId || formDisabled}
          className="transition-all duration-300"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={buttonDisabled}
        className="transition-all duration-300"
      >
        {isSubmitting ? (
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

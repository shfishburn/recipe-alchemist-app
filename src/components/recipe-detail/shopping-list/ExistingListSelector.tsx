
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recipe } from '@/types/recipe';
import type { ShoppingListSummary } from '@/types/shopping-list';

interface ExistingListSelectorProps {
  recipe: Recipe;
  onSelect: (listId: string, recipe: Recipe) => Promise<any>;
  isLoading: boolean;
}

export function ExistingListSelector({ recipe, onSelect, isLoading }: ExistingListSelectorProps) {
  const [selectedList, setSelectedList] = useState<string>("");
  const [lists, setLists] = useState<ShoppingListSummary[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const { user } = useAuth();

  // Fetch existing shopping lists
  useEffect(() => {
    const fetchShoppingLists = async () => {
      if (!user) return;
      
      try {
        setIsLoadingLists(true);
        const { data, error } = await supabase
          .from('shopping_lists')
          .select('id, title')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        setLists(data || []);
        // Auto-select the first list if available
        if (data && data.length > 0 && !selectedList) {
          setSelectedList(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
      } finally {
        setIsLoadingLists(false);
      }
    };
    
    fetchShoppingLists();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedList) {
      await onSelect(selectedList, recipe);
    }
  };

  if (isLoadingLists) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No existing shopping lists found.</p>
        <p className="text-sm text-muted-foreground mt-1">Please create a new list first.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="existing-list" className="text-sm font-medium">
          Select Shopping List
        </label>
        <Select 
          value={selectedList} 
          onValueChange={setSelectedList}
        >
          <SelectTrigger id="existing-list">
            <SelectValue placeholder="Select a shopping list" />
          </SelectTrigger>
          <SelectContent>
            {lists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!selectedList || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add to Selected List'
        )}
      </Button>
    </form>
  );
}

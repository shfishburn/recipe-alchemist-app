
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  department?: string;
  checked: boolean;
  user_id: string;
  list_id: string;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  user_id: string;
  recipe_id?: string;
  created_at: string;
  updated_at?: string;
  items?: ShoppingListItem[];
}

export function useShoppingList() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();
  
  /**
   * Load all shopping lists for the current user
   */
  const loadShoppingLists = useCallback(async () => {
    if (!session?.user) {
      setError('User must be logged in to access shopping lists');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setLists(data || []);
    } catch (err) {
      console.error('Error loading shopping lists:', err);
      setError('Failed to load shopping lists');
      toast.error('Could not load your shopping lists');
    } finally {
      setIsLoading(false);
    }
  }, [session]);
  
  /**
   * Load a specific shopping list by ID with its items
   */
  const loadShoppingListById = useCallback(async (id: string) => {
    if (!session?.user) {
      setError('User must be logged in to access shopping lists');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First get the list
      const { data: list, error: listError } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (listError) throw listError;
      if (!list) throw new Error('Shopping list not found');
      
      // Then get the items for this list
      const { data: items, error: itemsError } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('list_id', id)
        .eq('user_id', session.user.id)
        .order('department', { ascending: true })
        .order('name', { ascending: true });
      
      if (itemsError) throw itemsError;
      
      const listWithItems: ShoppingList = {
        ...list,
        items: items || []
      };
      
      setCurrentList(listWithItems);
      return listWithItems;
    } catch (err) {
      console.error('Error loading shopping list:', err);
      const message = err instanceof Error ? err.message : 'Failed to load shopping list';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);
  
  /**
   * Create a new shopping list from a recipe
   */
  const createShoppingListFromRecipe = useCallback(async (name: string, items: Array<{name: string, quantity?: string, unit?: string, department?: string}>, recipeId?: string) => {
    if (!session?.user) {
      setError('User must be logged in to create shopping lists');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the list
      const { data: list, error: listError } = await supabase
        .from('shopping_lists')
        .insert({
          name,
          user_id: session.user.id,
          recipe_id: recipeId || null
        })
        .select()
        .single();
      
      if (listError) throw listError;
      
      // Add all items to the list
      if (items.length > 0) {
        const itemsToInsert = items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          department: item.department || 'Other',
          checked: false,
          user_id: session.user.id,
          list_id: list.id
        }));
        
        const { error: itemsError } = await supabase
          .from('shopping_list_items')
          .insert(itemsToInsert);
        
        if (itemsError) throw itemsError;
      }
      
      toast.success('Shopping list created!');
      
      // Refresh lists
      await loadShoppingLists();
      
      return list;
    } catch (err) {
      console.error('Error creating shopping list:', err);
      const message = err instanceof Error ? err.message : 'Failed to create shopping list';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session, loadShoppingLists]);
  
  /**
   * Delete a shopping list and all its items
   */
  const deleteShoppingList = useCallback(async (id: string) => {
    if (!session?.user) {
      setError('User must be logged in to delete shopping lists');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Delete all items first (relying on cascade delete would be better, but let's be safe)
      const { error: itemsError } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('list_id', id)
        .eq('user_id', session.user.id);
      
      if (itemsError) throw itemsError;
      
      // Then delete the list
      const { error: listError } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);
      
      if (listError) throw listError;
      
      // Update local state
      setLists(prev => prev.filter(list => list.id !== id));
      if (currentList?.id === id) {
        setCurrentList(null);
      }
      
      toast.success('Shopping list deleted');
      return true;
    } catch (err) {
      console.error('Error deleting shopping list:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete shopping list';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, currentList]);
  
  /**
   * Update item status (checked/unchecked)
   */
  const updateItemStatus = useCallback(async (itemId: string, checked: boolean) => {
    if (!session?.user || !currentList) {
      setError('User must be logged in and a list must be selected');
      return false;
    }
    
    try {
      // First update local state for immediate feedback
      setCurrentList(prev => {
        if (!prev || !prev.items) return prev;
        
        return {
          ...prev,
          items: prev.items.map(item => 
            item.id === itemId ? { ...item, checked } : item
          )
        };
      });
      
      // Then update in database
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ checked })
        .eq('id', itemId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating item status:', err);
      // Revert local state on error
      loadShoppingListById(currentList.id);
      return false;
    }
  }, [session, currentList, loadShoppingListById]);
  
  return {
    lists,
    currentList,
    isLoading,
    error,
    loadShoppingLists,
    loadShoppingListById,
    createShoppingListFromRecipe,
    deleteShoppingList,
    updateItemStatus
  };
}

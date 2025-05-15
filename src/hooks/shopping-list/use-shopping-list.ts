
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export interface ShoppingListItem {
  id: string;
  ingredient: string;
  quantity: number;
  unit: string;
  purchased: boolean;
  category?: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingListItem[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useShoppingList() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const fetchLists = useCallback(async () => {
    if (!session?.user) {
      setError("Authentication required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', session.user.id)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setLists(data || []);
    } catch (err: any) {
      console.error("Error fetching shopping lists:", err);
      setError(err.message || "Failed to fetch shopping lists");
      toast.error("Failed to load shopping lists");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const createList = useCallback(async (title: string, items: ShoppingListItem[] = []) => {
    if (!session?.user) {
      setError("Authentication required");
      toast.error("Please sign in to create a shopping list");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newList = {
        title,
        items,
        user_id: session.user.id
      };

      const { data, error: insertError } = await supabase
        .from('shopping_lists')
        .insert(newList)
        .select()
        .single();

      if (insertError) throw insertError;
      
      setLists(prev => [data, ...prev]);
      toast.success("Shopping list created");
      return data;
    } catch (err: any) {
      console.error("Error creating shopping list:", err);
      setError(err.message || "Failed to create shopping list");
      toast.error("Failed to create shopping list");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const updateList = useCallback(async (id: string, updates: Partial<ShoppingList>) => {
    if (!session?.user) {
      setError("Authentication required");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure we're updating only allowed fields and include updated_at
      const sanitizedUpdates = {
        ...(updates.title && { title: updates.title }),
        ...(updates.items && { items: updates.items }),
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update(sanitizedUpdates)
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;
      
      // Update local state
      setLists(prev => prev.map(list => 
        list.id === id ? { ...list, ...sanitizedUpdates } : list
      ));
      
      toast.success("Shopping list updated");
      return true;
    } catch (err: any) {
      console.error("Error updating shopping list:", err);
      setError(err.message || "Failed to update shopping list");
      toast.error("Failed to update shopping list");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const deleteList = useCallback(async (id: string) => {
    if (!session?.user) {
      setError("Authentication required");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Soft delete by setting deleted_at
      const { error: deleteError } = await supabase
        .from('shopping_lists')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (deleteError) throw deleteError;
      
      // Update local state
      setLists(prev => prev.filter(list => list.id !== id));
      
      toast.success("Shopping list deleted");
      return true;
    } catch (err: any) {
      console.error("Error deleting shopping list:", err);
      setError(err.message || "Failed to delete shopping list");
      toast.error("Failed to delete shopping list");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Initialize by loading lists if user is authenticated
  const initialize = useCallback(() => {
    if (session?.user) {
      fetchLists();
    }
  }, [session, fetchLists]);

  return {
    lists,
    isLoading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
    initialize
  };
}

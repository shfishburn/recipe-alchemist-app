
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import type { ShoppingList, ShoppingListItem } from '@/types/shopping-list';

export function useShoppingList() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { session } = useAuth();
  
  // Additional properties needed by ShoppingListDetail component
  const searchTerm = '';
  const setSearchTerm = () => {};
  const sortOrder = 'dept' as 'asc' | 'desc' | 'dept';
  const setSortOrder = () => {};
  const expandedDepts = {};
  const groupedItems = [];
  const allDepartments = [];
  const itemsByDepartment = {};
  const handleToggleItem = () => {};
  const handleDeleteItem = () => {};
  const handleAddItem = () => {};
  const toggleAllInDepartment = () => {};
  const toggleDeptExpanded = () => {};
  const copyToClipboard = () => {};
  const getItemIndex = () => -1;
  
  const fetchLists = async () => {
    if (!session?.user) {
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      setLists(data || []);
    } catch (err: any) {
      console.error('Error fetching shopping lists:', err);
      setError(err.message || 'Failed to fetch shopping lists');
      toast.error('Failed to load shopping lists');
    } finally {
      setIsLoading(false);
    }
  };

  const createList = async (title: string, items: ShoppingListItem[] = []) => {
    if (!session?.user) {
      setError('Authentication required');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('shopping_lists')
        .insert({
          title,
          items,
          user_id: session.user.id
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      toast.success('Shopping list created');
      await fetchLists();
      return data;
    } catch (err: any) {
      console.error('Error creating shopping list:', err);
      setError(err.message || 'Failed to create shopping list');
      toast.error('Failed to create shopping list');
      return null;
    }
  };

  const updateList = async (id: string, updates: Partial<ShoppingList>) => {
    try {
      const { error: updateError } = await supabase
        .from('shopping_lists')
        .update(updates)
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      toast.success('Shopping list updated');
      await fetchLists();
      return true;
    } catch (err: any) {
      console.error('Error updating shopping list:', err);
      setError(err.message || 'Failed to update shopping list');
      toast.error('Failed to update shopping list');
      return false;
    }
  };

  const deleteList = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw deleteError;
      
      toast.success('Shopping list deleted');
      await fetchLists();
      return true;
    } catch (err: any) {
      console.error('Error deleting shopping list:', err);
      setError(err.message || 'Failed to delete shopping list');
      toast.error('Failed to delete shopping list');
      return false;
    }
  };

  const initialize = () => {
    if (session?.user) {
      fetchLists();
    }
  };

  // Initialize on mount and when auth changes
  useEffect(() => {
    initialize();
  }, [session?.user?.id]);

  return {
    lists,
    isLoading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
    initialize,
    // Add all the properties needed by ShoppingListDetail
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    expandedDepts,
    groupedItems,
    allDepartments,
    itemsByDepartment,
    handleToggleItem,
    handleDeleteItem,
    handleAddItem,
    toggleAllInDepartment,
    toggleDeptExpanded,
    copyToClipboard,
    getItemIndex
  };
}

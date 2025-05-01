
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { ShoppingList } from '@/types/shopping-list';
import type { Json } from '@/integrations/supabase/types';

export function useShoppingLists() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { 
    data: shoppingLists = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['shopping-lists'],
    queryFn: async () => {
      if (!session) return [] as ShoppingList[];
      
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch shopping lists',
          variant: 'destructive'
        });
        return [] as ShoppingList[];
      }
      
      // Transform the data to match the ShoppingList type
      return (data || []).map(list => ({
        ...list,
        items: Array.isArray(list.items) ? list.items : []
      })) as ShoppingList[];
    },
    enabled: !!session
  });

  const createNewList = async () => {
    if (!session || !newListTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .insert({
          title: newListTitle,
          user_id: session.user.id,
          items: []
        });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create shopping list',
          variant: 'destructive'
        });
      } else {
        setNewListTitle('');
        refetch();
        toast({
          title: 'Success',
          description: 'Shopping list created'
        });
      }
    } catch (err) {
      console.error('Error creating list:', err);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteList = async (listId: string) => {
    setListToDelete(listId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteList = async () => {
    if (!listToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Soft delete the list
      const { error } = await supabase
        .from('shopping_lists')
        .update({ 
          deleted_at: new Date().toISOString() 
        })
        .eq('id', listToDelete);

      if (error) {
        throw error;
      }

      // Refresh the list
      await refetch();
      
      toast({
        title: 'List deleted',
        description: 'Shopping list has been deleted'
      });
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete shopping list',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setListToDelete(null);
      
      // If we deleted the currently selected list, go back to the list view
      if (selectedList?.id === listToDelete) {
        setSelectedList(null);
      }
    }
  };

  // Filter shopping lists by search term
  const filteredLists = searchTerm.trim() === '' 
    ? shoppingLists 
    : shoppingLists.filter(list => 
        list.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return {
    shoppingLists: filteredLists,
    isLoading,
    newListTitle,
    setNewListTitle,
    selectedList,
    setSelectedList,
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isDeleting,
    handleDeleteList,
    confirmDeleteList,
    createNewList,
    refetch,
    session
  };
}

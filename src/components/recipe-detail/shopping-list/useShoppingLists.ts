
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ShoppingListSummary } from '@/types/shopping-list';

export function useShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingListSummary[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const fetchShoppingLists = useCallback(async () => {
    // Avoid redundant fetches if already loading
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add items to a shopping list.",
          variant: "destructive",
        });
        return;
      }
      
      const { data: lists, error } = await supabase
        .from('shopping_lists')
        .select('id, title')
        .is('deleted_at', null) // Filter out deleted lists
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setShoppingLists(lists || []);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your shopping lists.",
        variant: "destructive",
      });
    } finally {
      // Add a small delay before removing loading state
      // This helps prevent UI flashing
      setTimeout(() => {
        setIsFetching(false);
      }, 200);
    }
  }, [toast]);

  return {
    shoppingLists,
    isFetching,
    fetchShoppingLists,
  };
}


import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ShoppingList, ShoppingListSummary } from '@/types/shopping-list';

export function useShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingListSummary[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  const fetchShoppingLists = async () => {
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
      setIsFetching(false);
    }
  };

  return {
    shoppingLists,
    isFetching,
    fetchShoppingLists,
  };
}


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { ShoppingListCard } from '@/components/shopping-list/ShoppingListCard';
import { ShoppingListDetail } from '@/components/shopping-list/ShoppingListDetail';
import type { ShoppingList } from '@/types/shopping-list';
import type { Json } from '@/integrations/supabase/types';

const ShoppingLists = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);

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
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Please log in to view your shopping lists</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold mb-6">Shopping Lists</h1>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {selectedList ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedList(null)}
                  className="mb-4"
                >
                  ← Back to lists
                </Button>
                <ShoppingListDetail 
                  list={selectedList} 
                  onUpdate={refetch} 
                />
              </>
            ) : (
              <>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="New shopping list name" 
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                  <Button onClick={createNewList}>Create List</Button>
                </div>

                {isLoading ? (
                  <div>Loading...</div>
                ) : !shoppingLists.length ? (
                  <p className="text-muted-foreground">No shopping lists yet</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {shoppingLists.map((list) => (
                      <ShoppingListCard 
                        key={list.id}
                        list={list}
                        onClick={() => setSelectedList(list)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingLists;

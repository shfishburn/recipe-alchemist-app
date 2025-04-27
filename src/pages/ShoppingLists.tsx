
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

type ShoppingListItem = {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};

type ShoppingList = {
  id: string;
  title: string;
  items: ShoppingListItem[];
  created_at: string;
};

const ShoppingLists = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [newListTitle, setNewListTitle] = useState('');

  const { 
    data: shoppingLists, 
    isLoading, 
    refetch 
  } = useQuery<ShoppingList[]>({
    queryKey: ['shopping-lists'],
    queryFn: async () => {
      if (!session) return [];
      
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
        return [];
      }
      
      return data;
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
            ) : shoppingLists?.length === 0 ? (
              <p className="text-muted-foreground">No shopping lists yet</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {shoppingLists?.map((list) => (
                  <Card key={list.id}>
                    <CardHeader>
                      <CardTitle>{list.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{list.items.length} items</p>
                      {/* Future: Add more list details */}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingLists;

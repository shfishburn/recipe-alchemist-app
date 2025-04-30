
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
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Plus, Loader2 } from 'lucide-react';

const ShoppingLists = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter shopping lists by search term
  const filteredLists = searchTerm.trim() === '' 
    ? shoppingLists 
    : shoppingLists.filter(list => 
        list.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-4">Please log in to view your shopping lists</p>
            <Button asChild>
              <Link to="/auth">Log In</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-6 md:py-8 pb-16 sm:pb-20">
          {!selectedList && (
            <nav className="mb-4" aria-label="Breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>My Market</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </nav>
          )}
          
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
              <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">My Market</h1>
              <p className="text-base text-muted-foreground mb-6 md:mb-8">
                Create and manage shopping lists for your recipes.
              </p>
              
              <div className="max-w-4xl mx-auto space-y-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex space-x-2">
                    <Input 
                      placeholder="New shopping list name" 
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                    />
                    <Button 
                      onClick={() => createNewList()}
                      disabled={!newListTitle.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search lists"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : !filteredLists.length ? (
                  <div className="text-center py-10 bg-muted/20 rounded-lg">
                    <ShoppingBag className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchTerm.trim() ? "No matching shopping lists found" : "No shopping lists yet"}
                    </p>
                    {searchTerm.trim() && (
                      <Button variant="link" onClick={() => setSearchTerm('')}>
                        Clear search
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredLists.map((list) => (
                      <ShoppingListCard 
                        key={list.id}
                        list={list}
                        onClick={() => setSelectedList(list)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShoppingLists;

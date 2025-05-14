
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  recipe_id?: string; // Make sure recipe_id is included when relevant
  notes?: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  items: ShoppingItem[];
  recipe_ids?: string[]; // Track source recipes
}

export function useShoppingList() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatingFromRecipe, setIsCreatingFromRecipe] = useState(false);

  // Fetch user's shopping lists
  const {
    data: shoppingLists,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['shopping-lists', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      return data as ShoppingList[];
    },
    enabled: !!userId,
  });

  // Create a new shopping list
  const createList = useMutation({
    mutationFn: async ({ title, items = [], recipeId }: 
    { title: string; items?: ShoppingItem[]; recipeId?: string }) => {
      if (!userId) throw new Error("User not authenticated");
      
      setIsCreatingFromRecipe(!!recipeId);
      
      try {
        // Ensure recipe_id is set on all items coming from this recipe
        if (recipeId) {
          items = items.map(item => ({
            ...item,
            recipe_id: recipeId
          }));
        }
        
        // Prepare the new shopping list
        const newList = {
          title,
          user_id: userId,
          items,
          recipe_ids: recipeId ? [recipeId] : undefined
        };
        
        console.log("Creating shopping list with recipe reference:", {
          hasRecipeId: !!recipeId,
          itemCount: items.length
        });
        
        const { data, error } = await supabase
          .from('shopping_lists')
          .insert(newList)
          .select();
          
        if (error) throw error;
        return data[0] as ShoppingList;
      } finally {
        setIsCreatingFromRecipe(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists', userId] });
      toast({
        title: "Shopping list created",
        description: "Your new shopping list is ready!"
      });
    },
    onError: (error) => {
      console.error("Failed to create shopping list:", error);
      toast({
        title: "Failed to create list",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Generate a shopping list from a recipe
  const generateFromRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!userId) throw new Error("User not authenticated");
      if (!recipeId) throw new Error("Recipe ID is required");
      
      setIsCreatingFromRecipe(true);
      
      try {
        console.log("Generating shopping list for recipe:", recipeId);
        
        const response = await supabase.functions.invoke('generate-shopping-list', {
          body: { recipeId }
        });
        
        if (response.error) throw new Error(response.error.message);
        if (!response.data) throw new Error("No data returned from function");
        
        // Create the shopping list with the generated items
        const { title, items } = response.data;
        
        // Ensure all items have the recipe_id property
        const itemsWithRecipeId = items.map(item => ({
          ...item,
          recipe_id: recipeId
        }));
        
        const { data, error } = await supabase
          .from('shopping_lists')
          .insert({
            title,
            user_id: userId,
            items: itemsWithRecipeId,
            recipe_ids: [recipeId]
          })
          .select();
          
        if (error) throw error;
        return data[0] as ShoppingList;
      } finally {
        setIsCreatingFromRecipe(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-lists', userId] });
      toast({
        title: "Shopping list created",
        description: "Your shopping list has been generated from the recipe!"
      });
    },
    onError: (error) => {
      console.error("Failed to generate shopping list:", error);
      toast({
        title: "Failed to generate list",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    shoppingLists,
    isLoading,
    error,
    refetch,
    createList,
    generateFromRecipe,
    isCreatingFromRecipe
  };
}

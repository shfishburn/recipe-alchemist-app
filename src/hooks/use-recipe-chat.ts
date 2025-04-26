import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe, Ingredient, Nutrition } from '@/hooks/use-recipe-detail';
import type { Database } from '@/integrations/supabase/types';
import type { Json } from '@/integrations/supabase/types';

interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  changes_suggested: {
    title?: string;
    ingredients?: {
      mode: 'add' | 'replace' | 'none';
      items: Array<{
        qty: number;
        unit: string;
        item: string;
      }>;
    };
    instructions?: string[];
    nutrition?: {
      kcal?: number;
      protein_g?: number;
      carbs_g?: number;
      fat_g?: number;
      fiber_g?: number;
      sugar_g?: number;
      sodium_mg?: number;
    };
  } | null;
  applied: boolean;
  created_at: string;
}

export const useRecipeChat = (recipe: Recipe) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chatHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['recipe-chats', recipe.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipe.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await supabase.functions.invoke('recipe-chat', {
        body: { recipe, userMessage: message }
      });

      if (response.error) throw response.error;

      const { data, error } = await supabase
        .from('recipe_chats')
        .insert({
          recipe_id: recipe.id,
          user_message: message,
          ai_response: response.data.response,
          changes_suggested: response.data.changes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyChanges = useMutation({
    mutationFn: async (chatMessage: ChatMessage) => {
      if (!chatMessage.changes_suggested) return;

      let imageUrl = recipe.image_url;
      if (
        chatMessage.changes_suggested.title || 
        (chatMessage.changes_suggested.ingredients && 
         chatMessage.changes_suggested.ingredients.mode === 'replace')
      ) {
        try {
          const response = await supabase.functions.invoke('generate-recipe-image', {
            body: {
              title: chatMessage.changes_suggested.title || recipe.title,
              ingredients: chatMessage.changes_suggested.ingredients?.items || recipe.ingredients,
              instructions: chatMessage.changes_suggested.instructions || recipe.instructions,
            },
          });

          if (response.error) throw response.error;
          imageUrl = response.data.imageUrl;
        } catch (error) {
          console.error('Error generating image:', error);
        }
      }

      const newRecipeData = {
        ...recipe,
        id: undefined,
        previous_version_id: recipe.id,
        version_number: recipe.version_number + 1,
        title: chatMessage.changes_suggested.title || recipe.title,
        instructions: chatMessage.changes_suggested.instructions || recipe.instructions,
        nutrition: chatMessage.changes_suggested.nutrition || recipe.nutrition,
        image_url: imageUrl,
      };

      if (chatMessage.changes_suggested.ingredients) {
        const { mode, items } = chatMessage.changes_suggested.ingredients;
        
        if (mode === 'add' && items) {
          newRecipeData.ingredients = [...recipe.ingredients, ...items];
        } else if (mode === 'replace' && items) {
          newRecipeData.ingredients = items;
        }
      }

      const { data: newRecipe, error } = await supabase
        .from('recipes')
        .insert({
          ...newRecipeData,
          ingredients: newRecipeData.ingredients as unknown as Json,
          nutrition: newRecipeData.nutrition as unknown as Json
        })
        .select()
        .single();

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('recipe_chats')
        .update({ applied: true })
        .eq('id', chatMessage.id);

      if (updateError) throw updateError;

      return newRecipe;
    },
    onSuccess: (newRecipe) => {
      toast({
        title: "Changes applied",
        description: `Created version ${newRecipe.version_number} of the recipe`,
      });
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      window.location.href = `/recipes/${newRecipe.id}`;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    message,
    setMessage,
    chatHistory,
    isLoadingHistory,
    sendMessage: () => mutation.mutate(message),
    isSending: mutation.isPending,
    applyChanges,
    isApplying: applyChanges.isPending,
  };
};

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/hooks/use-recipe-detail';
import type { Database } from '@/integrations/supabase/types';

interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  changes_suggested: {
    title?: string;
    ingredients?: Array<{
      qty: number;
      unit: string;
      item: string;
    }>;
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

      const newRecipeData = {
        ...recipe,
        id: undefined, // Let Supabase generate a new ID
        previous_version_id: recipe.id,
        version_number: recipe.version_number + 1,
        title: chatMessage.changes_suggested.title || recipe.title,
        ingredients: chatMessage.changes_suggested.ingredients || recipe.ingredients,
        instructions: chatMessage.changes_suggested.instructions || recipe.instructions,
        nutrition: chatMessage.changes_suggested.nutrition || recipe.nutrition,
      };

      const { data: newRecipe, error } = await supabase
        .from('recipes')
        .insert(newRecipeData)
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
        description: "A new version of the recipe has been created.",
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

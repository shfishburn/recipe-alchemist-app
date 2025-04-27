
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import { useChatMutations } from './recipe-chat/use-chat-mutations';
import { useApplyChanges } from './recipe-chat/use-apply-changes';

export type { ChatMessage };

export const useRecipeChat = (recipe: Recipe) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();

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

  const mutation = useChatMutations(recipe);
  const applyChanges = useApplyChanges(recipe);

  const uploadRecipeImage = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        mutation.mutate({
          message: "Please analyze this recipe image",
          sourceType: 'image',
          sourceImage: base64Image
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  const submitRecipeUrl = (url: string) => {
    mutation.mutate({
      message: "Please analyze this recipe URL",
      sourceType: 'url',
      sourceUrl: url
    });
  };

  return {
    message,
    setMessage,
    chatHistory,
    isLoadingHistory,
    sendMessage: () => mutation.mutate({ message }),
    isSending: mutation.isPending,
    applyChanges,
    isApplying: applyChanges.isPending,
    uploadRecipeImage,
    submitRecipeUrl,
  };
};

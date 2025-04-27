
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage } from '@/types/chat';
import type { Json } from '@/integrations/supabase/types';

export const useChatMutations = (recipe: Recipe) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ message, sourceType, sourceUrl, sourceImage }: {
      message: string;
      sourceType?: 'manual' | 'image' | 'url';
      sourceUrl?: string;
      sourceImage?: string;
    }) => {
      toast({
        title: "Processing your request",
        description: sourceType === 'manual' 
          ? "Our culinary scientist is analyzing your recipe..."
          : "Extracting recipe information...",
      });
      
      const response = await supabase.functions.invoke('recipe-chat', {
        body: { 
          recipe, 
          userMessage: message,
          sourceType,
          sourceUrl,
          sourceImage
        }
      });

      if (response.error) throw response.error;
      
      const { data, error } = await supabase
        .from('recipe_chats')
        .insert({
          recipe_id: recipe.id,
          user_message: message,
          ai_response: response.data.response,
          changes_suggested: response.data.changes || null,
          follow_up_questions: response.data.followUpQuestions || [],
          source_type: sourceType || 'manual',
          source_url: sourceUrl,
          source_image: sourceImage
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      toast({
        title: "Response received",
        description: "Culinary analysis complete",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return mutation;
};

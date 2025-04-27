
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
      console.log("Starting recipe chat mutation:", { message, sourceType });
      
      toast({
        title: "Processing your request",
        description: sourceType === 'manual' 
          ? "Our culinary scientist is analyzing your recipe..."
          : "Extracting recipe information...",
      });
      
      console.log("Invoking recipe-chat edge function");
      const response = await supabase.functions.invoke('recipe-chat', {
        body: { 
          recipe, 
          userMessage: message,
          sourceType,
          sourceUrl,
          sourceImage
        }
      });

      if (response.error) {
        console.error("Edge function returned an error:", response.error);
        throw response.error;
      }
      
      console.log("Edge function response:", response.data);
      
      if (!response.data) {
        console.error("Edge function returned no data");
        throw new Error("No data returned from edge function");
      }
      
      if (response.data.error) {
        console.error("Edge function response contains error:", response.data.error);
        throw new Error(response.data.error);
      }

      // Insert the chat message into the database
      console.log("Saving chat message to database");
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

      if (error) {
        console.error("Error saving chat to database:", error);
        throw error;
      }
      
      console.log("Chat successfully saved to database with ID:", data.id);
      return data;
    },
    onSuccess: () => {
      console.log("Recipe chat mutation completed successfully");
      queryClient.invalidateQueries({ queryKey: ['recipe-chats', recipe.id] });
      toast({
        title: "Response received",
        description: "Culinary analysis complete",
      });
    },
    onError: (error) => {
      console.error("Recipe chat mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

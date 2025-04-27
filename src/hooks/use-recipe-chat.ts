
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
      console.log(`Fetching chat history for recipe ${recipe.id}`);
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipe.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching chat history:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} chat messages for recipe ${recipe.id}`);
      } else {
        console.log(`No existing chat history for recipe ${recipe.id}`);
      }
      
      // Process the chat messages to handle follow_up_questions
      return data.map(chat => {
        const chatMessage: ChatMessage = {
          id: chat.id,
          user_message: chat.user_message,
          ai_response: chat.ai_response,
          changes_suggested: chat.changes_suggested,
          applied: chat.applied || false,
          created_at: chat.created_at
        };

        // Parse follow_up_questions if it exists and is a string
        if (chat.changes_suggested && 'follow_up_questions' in chat) {
          try {
            // If it's a string, parse it; if it's already an array, use it directly
            const questions = typeof chat.follow_up_questions === 'string' 
              ? JSON.parse(chat.follow_up_questions) 
              : chat.follow_up_questions;
            
            chatMessage.follow_up_questions = Array.isArray(questions) ? questions : [];
          } catch (e) {
            console.error("Error parsing follow_up_questions:", e);
            chatMessage.follow_up_questions = [];
          }
        } else {
          chatMessage.follow_up_questions = [];
        }
        
        return chatMessage;
      });
    },
  });

  const mutation = useChatMutations(recipe);
  const applyChanges = useApplyChanges(recipe);

  const uploadRecipeImage = async (file: File) => {
    try {
      console.log("Processing image upload");
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
      console.error("Image upload error:", error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  const submitRecipeUrl = (url: string) => {
    console.log("Processing URL submission:", url);
    mutation.mutate({
      message: "Please analyze this recipe URL",
      sourceType: 'url',
      sourceUrl: url
    });
  };

  const sendMessage = () => {
    console.log("Sending chat message:", message.substring(0, 30) + (message.length > 30 ? '...' : ''));
    mutation.mutate({ message });
  };

  return {
    message,
    setMessage,
    chatHistory,
    isLoadingHistory,
    sendMessage,
    isSending: mutation.isPending,
    applyChanges,
    isApplying: applyChanges.isPending,
    uploadRecipeImage,
    submitRecipeUrl,
  };
};

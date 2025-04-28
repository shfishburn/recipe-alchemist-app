
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage, OptimisticMessage, ChangesResponse } from '@/types/chat';
import { useChatMutations } from './recipe-chat/use-chat-mutations';
import { useApplyChanges } from './recipe-chat/use-apply-changes';

export type { ChatMessage };

export const useRecipeChat = (recipe: Recipe) => {
  const [message, setMessage] = useState('');
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const { toast } = useToast();

  const { data: chatHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['recipe-chats', recipe.id],
    queryFn: async () => {
      console.log(`Fetching chat history for recipe ${recipe.id}`);
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipe.id)
        .eq('deleted_at', null)
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
      
      // Process the chat messages to handle follow_up_questions and changes_suggested
      return data.map(chat => {
        // Initialize chat message with default values
        const chatMessage: ChatMessage = {
          id: chat.id,
          user_message: chat.user_message,
          ai_response: chat.ai_response,
          changes_suggested: null,
          applied: chat.applied || false,
          created_at: chat.created_at,
          follow_up_questions: [] // Default empty array
        };

        // Process changes_suggested as a properly typed object
        if (chat.changes_suggested) {
          try {
            // Ensure changes_suggested is properly typed
            chatMessage.changes_suggested = chat.changes_suggested as unknown as ChangesResponse;
          } catch (e) {
            console.error("Error processing changes_suggested data:", e);
          }
        }
        
        // Check if the chat response has followUpQuestions in the response data
        if (typeof chat.ai_response === 'string') {
          try {
            // Try to extract follow-up questions from the AI response if they exist
            const responseObj = JSON.parse(chat.ai_response);
            if (responseObj && Array.isArray(responseObj.followUpQuestions)) {
              chatMessage.follow_up_questions = responseObj.followUpQuestions;
            }
          } catch (e) {
            // If parsing fails, just continue with the empty array
          }
        }
        
        return chatMessage;
      });
    },
    refetchOnWindowFocus: false,
  });

  const mutation = useChatMutations(recipe);
  const applyChanges = useApplyChanges(recipe);

  // Fixed: Changed from useCallback to useEffect to properly clear optimistic messages
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setOptimisticMessages([]);
    }
  }, [chatHistory]);

  const uploadRecipeImage = async (file: File) => {
    try {
      console.log("Processing image upload");
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        
        // Add optimistic message
        const optimisticMessage: OptimisticMessage = {
          user_message: "Analyzing recipe image...",
          pending: true
        };
        setOptimisticMessages([optimisticMessage]);
        
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
    
    // Add optimistic message
    const optimisticMessage: OptimisticMessage = {
      user_message: `Analyzing recipe from: ${url}`,
      pending: true
    };
    setOptimisticMessages([optimisticMessage]);
    
    mutation.mutate({
      message: "Please analyze this recipe URL",
      sourceType: 'url',
      sourceUrl: url
    });
  };

  const sendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    // Create optimistic message
    const optimisticMessage: OptimisticMessage = {
      user_message: message,
      pending: true
    };
    
    // Add to optimistic messages queue
    setOptimisticMessages([...optimisticMessages, optimisticMessage]);
    
    console.log("Sending chat message:", message.substring(0, 30) + (message.length > 30 ? '...' : ''));
    mutation.mutate({ message });
    setMessage(''); // Clear the input after sending
  };

  return {
    message,
    setMessage,
    chatHistory,
    optimisticMessages,
    isLoadingHistory,
    sendMessage,
    isSending: mutation.isPending,
    applyChanges,
    isApplying: applyChanges.isPending,
    uploadRecipeImage,
    submitRecipeUrl,
  };
};

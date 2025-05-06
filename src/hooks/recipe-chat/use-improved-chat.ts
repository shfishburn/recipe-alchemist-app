
/**
 * @deprecated This hook is deprecated as we're focusing only on Quick Recipe chat
 * Use useUnifiedRecipeChat with a QuickRecipe instead
 */
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { useRecipeMessages } from '@/store/use-chat-store';
import { useChatHistory } from './use-chat-history';
import { useApplyChanges } from './use-apply-changes';
import { useChatManagement } from './use-chat-management';

// Maximum time to wait for a response before showing a timeout error
const MAX_REQUEST_TIME = 60000; // 60 seconds

export function useImprovedChat(recipe: Recipe) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();
  
  // Get chat history from the database
  const { 
    chatHistory, 
    isLoadingHistory, 
    refetchChatHistory 
  } = useChatHistory(recipe.id);
  
  // Get chat messages from our Zustand store
  const {
    messages: storedMessages,
    optimisticMessages,
    messageStates,
    addMessage,
    updateMessage,
    addOptimisticMessage,
    removeOptimisticMessage,
    clearOptimisticMessages,
    clearChatHistory: clearStoredMessages
  } = useRecipeMessages(recipe.id);
  
  // Sync database messages to our store
  // Note: we're not storing chatHistory directly to prevent double-loading
  // in case refetchChatHistory is called
  const syncMessagesToStore = useCallback(() => {
    // Only sync if we have messages to sync
    if (!chatHistory.length) return;
    
    // Add any messages from the database that aren't in the store yet
    chatHistory.forEach(message => {
      // Skip messages we already have
      if (storedMessages.some(m => m.id === message.id)) return;
      
      // Add this message to our store
      addMessage(message);
    });
    
    // We're done syncing
    console.log(`Synced ${chatHistory.length} messages to store`);
  }, [chatHistory, storedMessages, addMessage]);
  
  // Sync messages when chatHistory changes
  if (chatHistory.length) {
    syncMessagesToStore();
  }
  
  // Apply changes from chat to the recipe
  const { applyChanges, isApplying: isApplyingOriginal } = useApplyChanges();
  
  // Handle chat management operations (clearing history)
  const { 
    clearChatHistory: clearDatabaseHistory 
  } = useChatManagement(recipe.id, refetchChatHistory, clearOptimisticMessages);
  
  // Improved message sending function with better error handling
  const sendMessage = useCallback(async () => {
    if (!message.trim() || isSending) return;
    
    const userMessage = message.trim();
    const messageId = `msg-${uuidv4()}`;
    
    // Create optimistic message for immediate feedback
    const optimisticMessage: OptimisticMessage = {
      id: messageId,
      user_message: userMessage,
      meta: { optimistic_id: messageId, created_at: Date.now() }
    };
    
    // Add to optimistic messages
    addOptimisticMessage(optimisticMessage);
    
    // Clear input
    setMessage('');
    setIsSending(true);
    
    // Set up request timeout
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Request timed out. Please try a shorter message or try again later.'));
      }, MAX_REQUEST_TIME);
    });
    
    try {
      // Race between the actual request and the timeout
      const requestPromise = supabase.functions.invoke('recipe-chat', {
        body: { 
          recipe, 
          userMessage,
          sourceType: 'manual',
          messageId
        }
      });
      
      // Wait for whichever finishes first
      const response = await Promise.race([requestPromise, timeoutPromise]);
      
      // Clear timeout since we got a response
      clearTimeout(timeoutId);
      
      if (!response.data) {
        throw new Error('No data returned from recipe chat function');
      }
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // Extract the AI response content
      const { textResponse, changes, followUpQuestions } = response.data;
      
      // Create the chat message to save to the database
      const newChatMessage: ChatMessage = {
        id: messageId,
        user_message: userMessage,
        ai_response: textResponse,
        recipe_id: recipe.id,
        changes_suggested: changes || null,
        follow_up_questions: followUpQuestions || [],
        meta: { 
          optimistic_id: messageId,
          created_at: Date.now(),
          received_at: Date.now()
        }
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('recipe_chats')
        .insert({
          recipe_id: recipe.id,
          user_message: userMessage,
          ai_response: textResponse,
          changes_suggested: changes || null,
          meta: { optimistic_id: messageId }
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add the real message to our store
      addMessage({
        ...newChatMessage,
        id: data.id, // Use the ID from the database
      });
      
      // Remove the optimistic message now that we have the real one
      removeOptimisticMessage(messageId);
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error sending chat message:', error);
      
      // Clear timeout if it's still running
      clearTimeout(timeoutId);
      
      // Show error toast
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
      
      // Update the optimistic message to show the error
      const failedMessage = optimisticMessages.find(m => m.id === messageId);
      if (failedMessage) {
        // Mark as failed in our store
        useChatStore.getState().markMessageAsFailed(messageId);
      }
      
      return false;
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, recipe, addOptimisticMessage, removeOptimisticMessage, toast, optimisticMessages, addMessage]);
  
  // Enhanced apply changes function
  const handleApplyChanges = useCallback(
    async (chatMessage: ChatMessage): Promise<boolean> => {
      setIsApplying(true);
      
      try {
        // Apply the changes
        const success = await applyChanges(recipe, chatMessage);
        
        if (success) {
          // Mark the message as applied
          const messageId = chatMessage.id || '';
          useChatStore.getState().markMessageAsApplied(messageId);
          
          // Also update in the database if we have an ID
          if (chatMessage.id) {
            await supabase
              .from('recipe_chats')
              .update({ applied: true })
              .eq('id', chatMessage.id);
            
            // Update our local message copy too
            updateMessage(chatMessage.id, { applied: true });
          }
          
          // Show success toast
          toast({
            title: 'Changes applied',
            description: 'The recipe has been updated with the suggested changes.',
          });
        }
        
        return success;
      } catch (error) {
        console.error('Error applying changes:', error);
        
        toast({
          title: 'Error',
          description: 'Failed to apply changes to the recipe.',
          variant: 'destructive',
        });
        
        return false;
      } finally {
        setIsApplying(false);
      }
    },
    [applyChanges, recipe, toast, updateMessage]
  );
  
  // Enhanced clear chat history function
  const clearAllChatHistory = useCallback(async () => {
    // Clear from the database
    await clearDatabaseHistory();
    
    // Also clear from our store
    clearStoredMessages();
    
    // Show success toast
    toast({
      title: 'Chat cleared',
      description: 'All chat messages have been removed.',
    });
  }, [clearDatabaseHistory, clearStoredMessages, toast]);
  
  // Upload a recipe image for analysis
  const uploadRecipeImage = useCallback(
    async (file: File) => {
      try {
        console.log("Processing image upload");
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string;
          
          // Create a unique message ID
          const messageId = `image-${uuidv4()}`;
          
          // Add optimistic message
          const optimisticMessage: OptimisticMessage = {
            id: messageId,
            user_message: "Analyzing recipe image...",
            meta: { optimistic_id: messageId, created_at: Date.now() }
          };
          addOptimisticMessage(optimisticMessage);
          
          setIsSending(true);
          
          try {
            // Send the request
            const response = await supabase.functions.invoke('recipe-chat', {
              body: { 
                recipe, 
                userMessage: "Please analyze this recipe image",
                sourceType: 'image',
                sourceImage: base64Image,
                messageId
              }
            });
            
            if (!response.data) {
              throw new Error('No data returned from recipe chat function');
            }
            
            if (response.data.error) {
              throw new Error(response.data.error);
            }
            
            // Success! The message will be added via the regular chat history sync
            toast({
              title: 'Image analyzed',
              description: 'The recipe image has been analyzed.',
            });
          } catch (error) {
            console.error('Error analyzing image:', error);
            
            // Mark as failed
            useChatStore.getState().markMessageAsFailed(messageId);
            
            toast({
              title: 'Error',
              description: error instanceof Error ? error.message : 'Failed to analyze image',
              variant: 'destructive',
            });
          } finally {
            setIsSending(false);
          }
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
    },
    [recipe, toast, addOptimisticMessage]
  );
  
  // Submit a recipe URL for analysis
  const submitRecipeUrl = useCallback(
    (url: string) => {
      if (!url.trim()) return;
      
      // Create a unique message ID
      const messageId = `url-${uuidv4()}`;
      
      // Add optimistic message
      const optimisticMessage: OptimisticMessage = {
        id: messageId,
        user_message: `Analyzing recipe from: ${url}`,
        meta: { optimistic_id: messageId, created_at: Date.now() }
      };
      addOptimisticMessage(optimisticMessage);
      
      setIsSending(true);
      
      supabase.functions
        .invoke('recipe-chat', {
          body: { 
            recipe, 
            userMessage: "Please analyze this recipe URL",
            sourceType: 'url',
            sourceUrl: url,
            messageId
          }
        })
        .then(response => {
          if (!response.data) {
            throw new Error('No data returned from recipe chat function');
          }
          
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          
          // Success! The message will be added via the regular chat history sync
          toast({
            title: 'URL analyzed',
            description: 'The recipe from the URL has been analyzed.',
          });
        })
        .catch(error => {
          console.error('Error analyzing URL:', error);
          
          // Mark as failed
          useChatStore.getState().markMessageAsFailed(messageId);
          
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to analyze URL',
            variant: 'destructive',
          });
        })
        .finally(() => {
          setIsSending(false);
        });
    },
    [recipe, toast, addOptimisticMessage]
  );
  
  return {
    // Chat input state
    message,
    setMessage,
    
    // Chat history
    chatHistory: storedMessages,
    optimisticMessages,
    messageStates,
    isLoadingHistory,
    
    // Chat actions
    sendMessage,
    isSending,
    uploadRecipeImage,
    submitRecipeUrl,
    
    // Recipe change application
    applyChanges: handleApplyChanges,
    isApplying: isApplying || isApplyingOriginal,
    
    // Management actions
    refetchChatHistory,
    clearChatHistory: clearAllChatHistory,
  };
}

// Import the chat store to access it from this helper function
import { useChatStore } from '@/store/use-chat-store';

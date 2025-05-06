
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { getChatMetaValue } from '@/utils/chat-meta';

/**
 * @deprecated This store is deprecated as we're focusing only on Quick Recipe chat
 */

interface MessageState {
  pending: boolean;
  failed: boolean;
  applied: boolean;
}

interface ChatState {
  // Chat messages organized by recipe ID
  messages: Record<string, ChatMessage[]>;
  // Optimistic messages that haven't been confirmed yet
  optimisticMessages: Record<string, OptimisticMessage[]>;
  // Message states tracked separately for more flexibility
  messageStates: Record<string, MessageState>;
}

interface ChatActions {
  // Message management
  addMessage: (recipeId: string, message: ChatMessage) => void;
  updateMessage: (recipeId: string, messageId: string, update: Partial<ChatMessage>) => void;
  addOptimisticMessage: (recipeId: string, message: OptimisticMessage) => void;
  removeOptimisticMessage: (recipeId: string, messageId: string) => void;
  clearOptimisticMessages: (recipeId: string) => void;
  clearChatHistory: (recipeId: string) => void;
  
  // Message state management
  setMessageState: (messageId: string, state: Partial<MessageState>) => void;
  markMessageAsFailed: (messageId: string) => void;
  markMessageAsSuccess: (messageId: string, message?: ChatMessage) => void;
  markMessageAsApplied: (messageId: string) => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set) => ({
      messages: {},
      optimisticMessages: {},
      messageStates: {},
      
      addMessage: (recipeId, message) => set((state) => {
        const recipeMessages = state.messages[recipeId] || [];
        return {
          messages: {
            ...state.messages,
            [recipeId]: [...recipeMessages, message]
          },
          // When adding a confirmed message, update its state
          messageStates: {
            ...state.messageStates,
            [message.id || '']: { 
              pending: false, 
              failed: false,
              applied: !!message.applied
            }
          }
        };
      }),
      
      updateMessage: (recipeId, messageId, update) => set((state) => {
        const recipeMessages = state.messages[recipeId] || [];
        return {
          messages: {
            ...state.messages,
            [recipeId]: recipeMessages.map(msg => 
              msg.id === messageId ? { ...msg, ...update } : msg
            )
          }
        };
      }),
      
      addOptimisticMessage: (recipeId, message) => set((state) => {
        const recipeOptimisticMessages = state.optimisticMessages[recipeId] || [];
        const messageId = message.id || `optimistic-${Date.now()}`;
        
        return {
          optimisticMessages: {
            ...state.optimisticMessages,
            [recipeId]: [...recipeOptimisticMessages, { ...message, id: messageId }]
          },
          // Track message state
          messageStates: {
            ...state.messageStates,
            [messageId]: { pending: true, failed: false, applied: false }
          }
        };
      }),
      
      removeOptimisticMessage: (recipeId, messageId) => set((state) => {
        const recipeOptimisticMessages = state.optimisticMessages[recipeId] || [];
        return {
          optimisticMessages: {
            ...state.optimisticMessages,
            [recipeId]: recipeOptimisticMessages.filter(msg => msg.id !== messageId)
          }
        };
      }),
      
      clearOptimisticMessages: (recipeId) => set((state) => ({
        optimisticMessages: {
          ...state.optimisticMessages,
          [recipeId]: []
        }
      })),
      
      clearChatHistory: (recipeId) => set((state) => ({
        messages: {
          ...state.messages,
          [recipeId]: []
        },
        optimisticMessages: {
          ...state.optimisticMessages,
          [recipeId]: []
        }
      })),
      
      setMessageState: (messageId, state) => set((prevState) => ({
        messageStates: {
          ...prevState.messageStates,
          [messageId]: {
            ...prevState.messageStates[messageId],
            ...state
          }
        }
      })),
      
      markMessageAsFailed: (messageId) => set((state) => ({
        messageStates: {
          ...state.messageStates,
          [messageId]: {
            pending: false,
            failed: true,
            applied: false
          }
        }
      })),
      
      markMessageAsSuccess: (messageId, message) => set((state) => {
        const newState = {
          messageStates: {
            ...state.messageStates,
            [messageId]: {
              pending: false,
              failed: false,
              applied: message?.applied || false
            }
          }
        };
        return newState;
      }),
      
      markMessageAsApplied: (messageId) => set((state) => ({
        messageStates: {
          ...state.messageStates,
          [messageId]: {
            ...state.messageStates[messageId],
            applied: true
          }
        }
      }))
    }),
    {
      name: 'recipe-chat-store',
      // Only persist messages, not transient state
      partialize: (state) => ({ 
        messages: state.messages
      }),
    }
  )
);

// Helper function to get messages for a specific recipe
export function useRecipeMessages(recipeId: string) {
  return useChatStore(state => ({
    messages: state.messages[recipeId] || [],
    optimisticMessages: state.optimisticMessages[recipeId] || [],
    messageStates: state.messageStates,
    addMessage: (message: ChatMessage) => state.addMessage(recipeId, message),
    updateMessage: (messageId: string, update: Partial<ChatMessage>) => 
      state.updateMessage(recipeId, messageId, update),
    addOptimisticMessage: (message: OptimisticMessage) => 
      state.addOptimisticMessage(recipeId, message),
    removeOptimisticMessage: (messageId: string) => 
      state.removeOptimisticMessage(recipeId, messageId),
    clearOptimisticMessages: () => state.clearOptimisticMessages(recipeId),
    clearChatHistory: () => state.clearChatHistory(recipeId)
  }));
}

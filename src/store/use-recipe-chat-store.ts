
import { create } from 'zustand';
import type { ChatMessage } from '@/types/chat';

interface RecipeChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  markMessageAsApplied: (messageId: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useRecipeChatStore = create<RecipeChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  // Add a new chat message to the store
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  // Mark a message as applied
  markMessageAsApplied: (messageId) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === messageId ? { ...msg, applied: true } : msg
    )
  })),
  
  // Set all messages (e.g., when loading from API)
  setMessages: (messages) => set({ messages }),
  
  // Clear all messages
  clearMessages: () => set({ messages: [] }),
  
  // Set error state
  setError: (error) => set({ error }),
  
  // Set loading state
  setLoading: (isLoading) => set({ isLoading })
}));

// Export a more convenient hook for accessing just the state
export function useRecipeChatStoreState() {
  return useRecipeChatStore(state => ({
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error
  }));
}

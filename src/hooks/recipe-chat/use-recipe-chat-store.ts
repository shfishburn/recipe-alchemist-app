
import { create } from 'zustand';
import type { ChatMessage } from '@/types/chat';

interface RecipeChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  addMessage: (message: ChatMessage) => void;
  markMessageAsApplied: (messageId: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create a singleton store for recipe chat state
export const useRecipeChatStore = create<RecipeChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  addMessage: (message) => 
    set((state) => ({
      messages: [...state.messages, message]
    })),
    
  markMessageAsApplied: (messageId) => 
    set((state) => ({
      messages: state.messages.map(msg => 
        msg.id === messageId ? { ...msg, applied: true } : msg
      )
    })),
    
  setMessages: (messages) => 
    set({ messages }),
    
  clearMessages: () => 
    set({ messages: [] }),
    
  setError: (error) => 
    set({ error }),
    
  setLoading: (isLoading) => 
    set({ isLoading }),
}));

// Export a hook for accessing the recipe chat store
export function useRecipeChatStoreState() {
  return useRecipeChatStore(state => ({
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error
  }));
}


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '@/types/recipe';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

/**
 * Represents a message state in the chat store
 */
interface MessageState {
  pending: boolean;
  failed: boolean;
  applied: boolean;
}

/**
 * Type for recipe identifiers - could be a database ID or a generated ID for temporary recipes
 */
type RecipeId = string;

/**
 * Unified chat store state interface
 */
interface UnifiedChatState {
  // Chat messages organized by recipe ID
  messages: Record<RecipeId, ChatMessage[]>;
  // Optimistic messages that haven't been confirmed yet
  optimisticMessages: Record<RecipeId, OptimisticMessage[]>;
  // Message states tracked separately for more flexibility
  messageStates: Record<string, MessageState>;
  // Track if messages are being loaded per recipe
  isLoadingMessages: Record<RecipeId, boolean>;
  // Track which recipes are quick recipes (temporary, not in database)
  quickRecipeIds: Set<RecipeId>;
}

/**
 * Chat store actions interface
 */
interface UnifiedChatActions {
  // Recipe type management
  registerQuickRecipe: (recipeId: RecipeId) => void;
  isQuickRecipe: (recipeId: RecipeId) => boolean;
  
  // Message management
  addMessage: (recipeId: RecipeId, message: ChatMessage) => void;
  updateMessage: (recipeId: RecipeId, messageId: string, update: Partial<ChatMessage>) => void;
  addOptimisticMessage: (recipeId: RecipeId, message: OptimisticMessage) => void;
  removeOptimisticMessage: (recipeId: RecipeId, messageId: string) => void;
  clearOptimisticMessages: (recipeId: RecipeId) => void;
  clearChatHistory: (recipeId: RecipeId) => Promise<void>;
  loadChatHistory: (recipeId: RecipeId, isQuickRecipe: boolean) => Promise<ChatMessage[]>;
  
  // Message state management
  setMessageState: (messageId: string, state: Partial<MessageState>) => void;
  markMessageAsFailed: (messageId: string) => void;
  markMessageAsSuccess: (messageId: string, message?: ChatMessage) => void;
  markMessageAsApplied: (messageId: string) => void;
  setLoadingMessages: (recipeId: RecipeId, isLoading: boolean) => void;
}

export const useUnifiedChatStore = create<UnifiedChatState & UnifiedChatActions>()(
  persist(
    (set, get) => ({
      messages: {},
      optimisticMessages: {},
      messageStates: {},
      isLoadingMessages: {},
      quickRecipeIds: new Set(),
      
      // Recipe type management
      registerQuickRecipe: (recipeId) => set((state) => ({
        quickRecipeIds: new Set([...state.quickRecipeIds, recipeId])
      })),
      
      isQuickRecipe: (recipeId) => {
        return get().quickRecipeIds.has(recipeId);
      },
      
      // Message management
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
      
      clearChatHistory: async (recipeId) => {
        const isQuickRecipe = get().isQuickRecipe(recipeId);
        
        // For quick recipes, just clear from local state
        if (isQuickRecipe) {
          set((state) => ({
            messages: {
              ...state.messages,
              [recipeId]: []
            },
            optimisticMessages: {
              ...state.optimisticMessages,
              [recipeId]: []
            }
          }));
          return;
        }
        
        // For database recipes, soft delete from the database
        try {
          const { error } = await supabase
            .from('recipe_chats')
            .update({ deleted_at: new Date().toISOString() })
            .eq('recipe_id', recipeId)
            .is('deleted_at', null);
            
          if (error) {
            console.error("Error clearing chat history:", error);
            throw error;
          }
          
          // If successful, also clear from local state
          set((state) => ({
            messages: {
              ...state.messages,
              [recipeId]: []
            },
            optimisticMessages: {
              ...state.optimisticMessages,
              [recipeId]: []
            }
          }));
        } catch (error) {
          console.error("Failed to clear chat history:", error);
          throw error;
        }
      },
      
      loadChatHistory: async (recipeId, isQuickRecipe) => {
        set((state) => ({
          isLoadingMessages: {
            ...state.isLoadingMessages,
            [recipeId]: true
          }
        }));
        
        try {
          let messages: ChatMessage[] = [];
          
          // For quick recipes, we don't need to fetch from the database
          if (isQuickRecipe) {
            // For quick recipes, we already have all messages in the store
            messages = get().messages[recipeId] || [];
          } else {
            // For database recipes, fetch from the database
            const { data, error } = await supabase
              .from('recipe_chats')
              .select('*')
              .eq('recipe_id', recipeId)
              .is('deleted_at', null)
              .order('created_at', { ascending: true });
              
            if (error) {
              console.error("Error loading chat history:", error);
              throw error;
            }
            
            // Process the database results
            messages = data.map(chat => ({
              id: chat.id,
              user_message: chat.user_message,
              ai_response: chat.ai_response,
              changes_suggested: chat.changes_suggested || null,
              follow_up_questions: chat.follow_up_questions || [],
              recipe_id: chat.recipe_id,
              applied: chat.applied || false,
              created_at: chat.created_at,
              meta: chat.meta || {}
            }));
            
            // Update store with fetched messages
            set((state) => ({
              messages: {
                ...state.messages,
                [recipeId]: messages
              }
            }));
          }
          
          set((state) => ({
            isLoadingMessages: {
              ...state.isLoadingMessages,
              [recipeId]: false
            }
          }));
          
          return messages;
        } catch (error) {
          console.error("Error loading chat history:", error);
          
          set((state) => ({
            isLoadingMessages: {
              ...state.isLoadingMessages,
              [recipeId]: false
            }
          }));
          
          return [];
        }
      },
      
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
      })),
      
      setLoadingMessages: (recipeId, isLoading) => set((state) => ({
        isLoadingMessages: {
          ...state.isLoadingMessages,
          [recipeId]: isLoading
        }
      }))
    }),
    {
      name: 'unified-recipe-chat-store',
      // Only persist messages, not transient state
      partialize: (state) => ({ 
        messages: state.messages,
        quickRecipeIds: Array.from(state.quickRecipeIds)
      }),
      // Custom merge function to handle Set serialization
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        quickRecipeIds: new Set(persisted.quickRecipeIds || [])
      }),
    }
  )
);

/**
 * Hook to access chat data and actions for a specific recipe
 */
export function useRecipeChatMessages(recipe: Recipe | QuickRecipe) {
  const recipeId = getRecipeId(recipe);
  const isQuickRecipe = isTemporaryRecipe(recipe);
  
  // Register quick recipes to track them properly
  const registerQuickRecipe = useUnifiedChatStore(state => state.registerQuickRecipe);
  if (isQuickRecipe) {
    registerQuickRecipe(recipeId);
  }
  
  return useUnifiedChatStore(state => ({
    messages: state.messages[recipeId] || [],
    optimisticMessages: state.optimisticMessages[recipeId] || [],
    messageStates: state.messageStates,
    isLoadingMessages: state.isLoadingMessages[recipeId] || false,
    
    // Actions
    addMessage: (message: ChatMessage) => state.addMessage(recipeId, message),
    updateMessage: (messageId: string, update: Partial<ChatMessage>) => 
      state.updateMessage(recipeId, messageId, update),
    addOptimisticMessage: (message: OptimisticMessage) => 
      state.addOptimisticMessage(recipeId, message),
    removeOptimisticMessage: (messageId: string) => 
      state.removeOptimisticMessage(recipeId, messageId),
    clearOptimisticMessages: () => state.clearOptimisticMessages(recipeId),
    clearChatHistory: () => state.clearChatHistory(recipeId),
    loadChatHistory: () => state.loadChatHistory(recipeId, isQuickRecipe),
    
    // Message state actions
    setMessageState: state.setMessageState,
    markMessageAsFailed: state.markMessageAsFailed,
    markMessageAsSuccess: state.markMessageAsSuccess,
    markMessageAsApplied: state.markMessageAsApplied
  }));
}

/**
 * Get a unique recipe identifier for any recipe type
 */
function getRecipeId(recipe: Recipe | QuickRecipe): string {
  if ('id' in recipe && typeof recipe.id === 'string') {
    return recipe.id;
  }
  
  // For quick/temporary recipes, generate a consistent ID
  return `temp-${recipe.title ? 
    `${recipe.title.substring(0, 20)}-${recipe.ingredients.length}` : 
    `quick-recipe-${Date.now()}`}`;
}

/**
 * Check if a recipe is a temporary recipe (QuickRecipe)
 */
function isTemporaryRecipe(recipe: Recipe | QuickRecipe): boolean {
  // Check if it has a string id (database recipes do)
  // QuickRecipe may not have an id or have a different format
  if ('id' in recipe && typeof recipe.id === 'string' && !recipe.id.startsWith('temp-')) {
    return false;
  }
  
  return true;
}

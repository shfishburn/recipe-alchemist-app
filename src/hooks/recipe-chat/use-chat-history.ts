
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for loading and managing recipe chat history
 */
export function useChatHistory(recipeId: string) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Load chat history
  const fetchChatHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      setError(null);
      
      // Query recipe chat messages
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipeId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });
        
      if (error) {
        throw new Error(`Error loading chat history: ${error.message}`);
      }
      
      // Transform database records to ChatMessage objects
      const transformedData: ChatMessage[] = (data || []).map(record => ({
        id: record.id,
        role: record.source_type === 'system' ? 'system' : 'user',
        content: record.user_message,
        user_message: record.user_message,
        ai_response: record.ai_response,
        timestamp: new Date(record.created_at).getTime(),
        applied: record.applied || false,
        changes_suggested: record.changes_suggested,
        meta: record.meta || {}
      }));
      
      setChatHistory(transformedData);
    } catch (err) {
      console.error("Error fetching chat history:", err);
      setError(err instanceof Error ? err : new Error('Failed to load chat history'));
      
      // Show error toast
      toast({
        title: "Failed to load chat history",
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [recipeId, toast]);
  
  // Refetch chat history
  const refetchChatHistory = useCallback(async () => {
    await fetchChatHistory();
  }, [fetchChatHistory]);
  
  // Load chat history on initial render
  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);
  
  return {
    chatHistory,
    isLoadingHistory,
    error,
    refetchChatHistory
  };
}

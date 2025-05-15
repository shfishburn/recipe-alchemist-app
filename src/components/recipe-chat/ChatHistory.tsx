
import React, { useMemo } from 'react';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import type { Recipe } from '@/types/recipe';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';
import { getMessageTrackingId } from '@/utils/chat-meta';

interface ChatHistoryProps {
  chatHistory: ChatMessageType[];
  optimisticMessages?: OptimisticMessage[];
  isSending?: boolean;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  recipe: Recipe;
  retryMessage?: () => void;
}

export function ChatHistory({
  chatHistory,
  optimisticMessages = [],
  isSending = false,
  setMessage,
  applyChanges,
  isApplying = false,
  recipe,
  retryMessage
}: ChatHistoryProps) {
  // Use a more reliable approach to filter out duplicate messages
  const combinedMessages = useMemo(() => {
    // Create a Set of tracking IDs from optimistic messages
    const optimisticIds = new Set(
      optimisticMessages.map(msg => getMessageTrackingId(msg))
        .filter(Boolean)
    );
    
    // Filter out real messages that have a corresponding optimistic message
    const filteredChatHistory = chatHistory.filter(msg => {
      const trackingId = getMessageTrackingId(msg);
      return !trackingId || !optimisticIds.has(trackingId);
    });
    
    // Return the filtered chat history followed by optimistic messages
    return [...filteredChatHistory, ...optimisticMessages];
  }, [chatHistory, optimisticMessages]);
  
  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Render the combined message history */}
      {combinedMessages.map((chat) => (
        <ChatMessage
          key={getMessageTrackingId(chat) || `chat-${Date.now()}-${Math.random()}`}
          chat={chat}
          setMessage={setMessage}
          applyChanges={applyChanges}
          isApplying={isApplying && chat.id === chatHistory[chatHistory.length - 1]?.id}
          isOptimistic={'pending' in chat && !!chat.pending}
          applied={!!chat.applied}
          retryMessage={retryMessage}
        />
      ))}
      
      {/* Show loading indicator when sending a message */}
      {isSending && <ChatProcessingIndicator stage="sending" />}
    </div>
  );
}

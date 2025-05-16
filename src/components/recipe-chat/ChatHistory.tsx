
import React, { useMemo } from 'react';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import type { Recipe } from '@/types/recipe';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';

interface ChatHistoryProps {
  chatHistory: ChatMessageType[];
  optimisticMessages?: OptimisticMessage[];
  isSending?: boolean;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  recipe: Recipe;
  retryMessage?: (failedMessage: string, failedMessageId: string) => void;
}

// Type that can represent either a ChatMessage or OptimisticMessage
type AnyMessageType = ChatMessageType | OptimisticMessage;

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
      optimisticMessages.map(msg => msg.meta?.optimistic_id)
        .filter(Boolean)
    );
    
    // Filter out real messages that have a corresponding optimistic message
    const filteredChatHistory = chatHistory.filter(msg => {
      const trackingId = msg.meta?.optimistic_id;
      return !trackingId || !optimisticIds.has(trackingId);
    });
    
    // Return the filtered chat history followed by optimistic messages
    return [...filteredChatHistory, ...optimisticMessages] as AnyMessageType[];
  }, [chatHistory, optimisticMessages]);
  
  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Render the combined message history */}
      {combinedMessages.map((message) => (
        <ChatMessage
          key={message.meta?.optimistic_id || message.id || `chat-${Date.now()}-${Math.random()}`}
          message={message}
          isUser={message.user_message !== undefined && !('ai_response' in message)}
          recipe={recipe}
          onApplyChanges={applyChanges}
          isApplying={isApplying && ('id' in message) && message.id === chatHistory[chatHistory.length - 1]?.id}
          onRetry={retryMessage}
        />
      ))}
      
      {/* Show loading indicator when sending a message */}
      {isSending && <ChatProcessingIndicator stage="sending" />}
    </div>
  );
}

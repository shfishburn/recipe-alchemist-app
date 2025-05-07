
import React from 'react';
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
}

export function ChatHistory({
  chatHistory,
  optimisticMessages = [],
  isSending = false,
  setMessage,
  applyChanges,
  isApplying = false,
  recipe
}: ChatHistoryProps) {
  // Filter out optimistic messages that already have a corresponding real message
  const optimisticIds = optimisticMessages.map(msg => msg.meta?.optimistic_id).filter(Boolean);
  
  // Filter out real messages that have a corresponding optimistic message
  const filteredChatHistory = chatHistory.filter(msg => {
    // Keep all messages that don't have an optimistic_id
    return !optimisticIds.includes(msg.meta?.optimistic_id);
  });
  
  return (
    <div className="flex flex-col space-y-6">
      {/* Render the actual chat history */}
      {filteredChatHistory.map((chat) => (
        <ChatMessage
          key={chat.id || `chat-${Date.now()}-${Math.random()}`}
          chat={chat}
          setMessage={setMessage}
          applyChanges={applyChanges}
          isApplying={isApplying && chat.id === chatHistory[chatHistory.length - 1]?.id}
          applied={!!chat.applied}
        />
      ))}
      
      {/* Render optimistic messages that don't have a real message yet */}
      {optimisticMessages.map((message) => (
        <ChatMessage
          key={message.id || `optimistic-${Date.now()}-${Math.random()}`}
          chat={message}
          setMessage={setMessage}
          applyChanges={applyChanges}
          isOptimistic={true}
        />
      ))}
      
      {/* Show loading indicator when sending a message */}
      {isSending && <ChatProcessingIndicator stage="sending" />}
    </div>
  );
}

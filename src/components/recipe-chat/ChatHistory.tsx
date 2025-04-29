
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';
import { EmptyChatState } from './EmptyChatState';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';

interface ChatHistoryProps {
  chatHistory: ChatMessageType[];
  optimisticMessages: OptimisticMessage[];
  isSending: boolean;
  setMessage: (message: string) => void;
  applyChanges: (chat: ChatMessageType) => void;
  isApplying: boolean;
  isLoading?: boolean;
}

export function ChatHistory({
  chatHistory,
  optimisticMessages,
  isSending,
  setMessage,
  applyChanges,
  isApplying,
  isLoading = false
}: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, optimisticMessages]);

  if (isLoading) {
    return <div className="py-4 text-center">Loading chat history...</div>;
  }

  if (chatHistory.length === 0 && optimisticMessages.length === 0) {
    return <EmptyChatState />;
  }

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Render confirmed chat messages */}
      {chatHistory.map((chat) => (
        <ChatMessage
          key={chat.id}
          chat={chat}
          setMessage={setMessage}
          applyChanges={applyChanges}
          isApplying={isApplying}
        />
      ))}
      
      {/* Render optimistic messages that haven't been confirmed yet */}
      {optimisticMessages.map((chat, index) => (
        <div key={`optimistic-${chat.id || index}`} className="opacity-90">
          <ChatMessage
            chat={chat}
            setMessage={setMessage}
            applyChanges={applyChanges}
            isApplying={isApplying}
            isOptimistic={true}
          />
        </div>
      ))}
      
      {/* Show processing indicator when sending */}
      {isSending && (
        <div className="flex justify-start pl-8 sm:pl-14 mt-1 sm:mt-2">
          <ChatProcessingIndicator stage="analyzing" />
        </div>
      )}
      
      {/* Invisible element for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
}

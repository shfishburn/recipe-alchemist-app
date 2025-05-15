
import React from 'react';
import { ChatMessage as ChatMessageComp } from './ChatMessage';
import { ChatResponse } from './ChatResponse';
import type { ChatMessage, OptimisticMessage } from '@/types/chat';

interface ChatHistoryProps {
  chatHistory: ChatMessage[];
  optimisticMessages: OptimisticMessage[];
  isApplying: boolean;
  applyChanges: (recipe: any, chatMessage: ChatMessage) => Promise<boolean>;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  optimisticMessages,
  isApplying,
  applyChanges
}) => {
  return (
    <div className="space-y-6">
      {/* Regular chat history */}
      {chatHistory.map((message) => (
        <div key={message.id}>
          <ChatMessageComp message={message.user_message} isUser={true} />
          <ChatResponse 
            chatMessage={message} 
            onApplyChanges={applyChanges}
            isApplying={isApplying}
          />
        </div>
      ))}
      
      {/* Optimistic messages */}
      {optimisticMessages.map((message) => (
        <div key={message.id}>
          <ChatMessageComp 
            message={message.user_message} 
            isUser={true} 
            isOptimistic={true} 
          />
        </div>
      ))}
      
      {/* Show empty state when no messages */}
      {chatHistory.length === 0 && optimisticMessages.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p>No messages yet. Start a conversation with the recipe AI!</p>
        </div>
      )}
    </div>
  );
};

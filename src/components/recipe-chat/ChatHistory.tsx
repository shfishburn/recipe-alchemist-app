
import React from 'react';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import type { Recipe } from '@/types/recipe';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';
import { hasChatMeta } from '@/utils/chat-meta';
import { AlertCircle } from 'lucide-react';

interface ChatHistoryProps {
  chatHistory: ChatMessageType[];
  optimisticMessages?: OptimisticMessage[];
  isSending?: boolean;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  recipe: Recipe;
  failedMessageIds?: string[];
}

export function ChatHistory({
  chatHistory,
  optimisticMessages = [],
  isSending = false,
  setMessage,
  applyChanges,
  isApplying = false,
  recipe,
  failedMessageIds = []
}: ChatHistoryProps) {
  // Create a map of optimistic message IDs for quick lookup
  const optimisticIds = new Map();
  optimisticMessages.forEach(msg => {
    const id = msg.id || msg.meta?.optimistic_id;
    if (id) optimisticIds.set(id, true);
  });
  
  // Filter out real messages that have a corresponding optimistic message
  const filteredChatHistory = chatHistory.filter(msg => {
    const msgOptId = msg.meta?.optimistic_id;
    return !msgOptId || !optimisticIds.has(msgOptId);
  });
  
  // Processing stage based on time elapsed
  const getProcessingStage = () => {
    if (optimisticMessages.length === 0) return 'sending';
    
    const now = Date.now();
    const firstOptimisticTime = parseInt(optimisticMessages[0].id?.split('-')[1] || '0');
    
    if (now - firstOptimisticTime > 5000) return 'processing';
    if (now - firstOptimisticTime > 2000) return 'analyzing';
    return 'sending';
  };
  
  const hasFailedMessages = failedMessageIds.length > 0;
  
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
      
      {/* Render optimistic messages */}
      {optimisticMessages.map((message) => (
        <ChatMessage
          key={message.id || `optimistic-${Date.now()}-${Math.random()}`}
          chat={message}
          setMessage={setMessage}
          applyChanges={applyChanges}
          isOptimistic={true}
          isFailed={failedMessageIds.includes(message.id || '')}
        />
      ))}
      
      {/* Show a more informative loading indicator based on the current stage */}
      {isSending && <ChatProcessingIndicator stage={getProcessingStage()} />}
      
      {/* Show error message for failed messages */}
      {hasFailedMessages && (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 text-red-500 text-sm p-2 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Message failed to send. Please try again.</span>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import type { Recipe } from '@/types/recipe';
import { ConnectedChatMessage } from './ConnectedChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';
import { EmptyChatState } from './EmptyChatState';
import { AlertCircle } from 'lucide-react';

interface ImprovedChatHistoryProps {
  chatHistory: ChatMessageType[];
  optimisticMessages: OptimisticMessage[];
  isSending: boolean;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  recipe: Recipe;
  messageStates: Record<string, { pending: boolean; failed: boolean; applied: boolean; }>;
}

export function ImprovedChatHistory({
  chatHistory,
  optimisticMessages,
  isSending,
  setMessage,
  applyChanges,
  isApplying = false,
  recipe,
  messageStates
}: ImprovedChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFailedMessages = Object.values(messageStates).some(state => state.failed);
  
  // Processing stage based on time elapsed
  const getProcessingStage = () => {
    if (optimisticMessages.length === 0) return 'sending';
    
    const now = Date.now();
    const firstOptimisticTime = parseInt(
      optimisticMessages[0].meta?.created_at?.toString() || 
      optimisticMessages[0].id?.split('-')[1] || '0'
    );
    
    if (now - firstOptimisticTime > 5000) return 'processing';
    if (now - firstOptimisticTime > 2000) return 'analyzing';
    return 'sending';
  };
  
  // Improved scroll behavior using requestAnimationFrame for better timing
  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: smooth ? 'smooth' : 'auto',
          block: 'end' 
        });
      }
    });
  };
  
  // Scroll to bottom when messages change or when sending
  useEffect(() => {
    // Short delay to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      scrollToBottom(true);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [chatHistory.length, optimisticMessages.length, isSending]);
  
  // Empty state check - show placeholder when no messages
  if (chatHistory.length === 0 && optimisticMessages.length === 0) {
    return <EmptyChatState />;
  }
  
  return (
    <div className="flex flex-col space-y-6">
      {/* Render all chat messages */}
      {chatHistory.map((chat) => (
        <ConnectedChatMessage
          key={chat.id || `chat-${Date.now()}-${Math.random()}`}
          chat={chat}
          setMessage={setMessage}
          applyChanges={applyChanges}
          isApplying={isApplying && chat.id === chatHistory[chatHistory.length - 1]?.id}
        />
      ))}
      
      {/* Render optimistic messages */}
      {optimisticMessages.map((message) => (
        <ConnectedChatMessage
          key={message.id || `optimistic-${Date.now()}-${Math.random()}`}
          chat={message}
          setMessage={setMessage}
          applyChanges={applyChanges}
        />
      ))}
      
      {/* Show a more informative loading indicator based on the current stage */}
      {isSending && <ChatProcessingIndicator stage={getProcessingStage()} />}
      
      {/* Show error message for failed messages */}
      {hasFailedMessages && (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 text-red-500 text-sm p-2 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Some messages failed to send. Please try again.</span>
          </div>
        </div>
      )}
      
      {/* Anchor for scrolling to bottom */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
}

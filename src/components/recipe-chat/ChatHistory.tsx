
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';
import { EmptyChatState } from './EmptyChatState';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';

interface ChatHistoryProps {
  chatHistory: ChatMessageType[];
  optimisticMessages: OptimisticMessage[];
  isSending: boolean;
  setMessage: (message: string) => void;
  applyChanges: (chat: ChatMessageType) => void;
  isApplying: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

export function ChatHistory({
  chatHistory,
  optimisticMessages,
  isSending,
  setMessage,
  applyChanges,
  isApplying,
  isLoading = false,
  hasError = false,
  onRetry
}: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(chatHistory.length + optimisticMessages.length);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    const currentCount = chatHistory.length + optimisticMessages.length;
    
    // Only scroll if message count increases or if we're sending/loading
    if (currentCount > prevMessageCountRef.current || isSending) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    prevMessageCountRef.current = currentCount;
  }, [chatHistory, optimisticMessages, isSending]);

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-6 rounded-full bg-primary/20 mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertTitle>There was an error loading your chat history</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>We couldn't load your previous messages. Please try again.</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </button>
          )}
        </AlertDescription>
      </Alert>
    );
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
      {optimisticMessages.map((chat) => (
        <div key={`optimistic-${chat.id}`} className="opacity-90">
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

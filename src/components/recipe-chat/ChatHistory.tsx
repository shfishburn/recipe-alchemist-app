
import React, { useRef, useEffect, useState } from 'react';
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
  const scrollTimeoutRef = useRef<number | null>(null);
  const [messageIds, setMessageIds] = useState<Set<string>>(new Set());
  
  // Track unique message IDs to prevent rendering duplicates
  useEffect(() => {
    const newIds = new Set<string>();
    chatHistory.forEach(msg => {
      if (msg.id) newIds.add(msg.id);
    });
    setMessageIds(newIds);
  }, [chatHistory]);

  // Enhanced auto-scroll to bottom with debounce for smoother experience
  const scrollToBottom = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = window.setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      scrollTimeoutRef.current = null;
    }, 100);
  };
  
  // Auto-scroll to bottom when new messages appear or when sending
  useEffect(() => {
    const currentCount = chatHistory.length + optimisticMessages.length;
    
    // Scroll if message count increases or if we're sending/loading
    if (currentCount > prevMessageCountRef.current || isSending) {
      scrollToBottom();
    }
    
    prevMessageCountRef.current = currentCount;
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
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

  // Filter out duplicate optimistic messages that already appear in chatHistory
  const filteredOptimisticMessages = optimisticMessages.filter(optMsg => {
    // Skip if this message text is already in chat history
    const isDuplicateContent = chatHistory.some(
      realMsg => realMsg.user_message === optMsg.user_message
    );
    
    // Skip if we have an ID match
    const isDuplicateId = optMsg.id && messageIds.has(optMsg.id);
    
    return !isDuplicateContent && !isDuplicateId;
  });

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Render confirmed chat messages */}
      {chatHistory.map((chat) => (
        <ChatMessage
          key={chat.id || `chat-${chat.created_at}`}
          chat={chat}
          setMessage={setMessage}
          applyChanges={applyChanges}
          isApplying={isApplying}
        />
      ))}
      
      {/* Render optimistic messages that haven't been confirmed yet */}
      {filteredOptimisticMessages.map((chat) => (
        <div key={`optimistic-${chat.id || Date.now()}`} className="opacity-90">
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

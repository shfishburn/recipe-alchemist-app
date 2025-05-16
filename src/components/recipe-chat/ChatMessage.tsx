
import React from 'react';
import { ChatResponse } from './ChatResponse';
import { UserMessage } from './UserMessage';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import { getChatMeta } from '@/utils/chat-meta';

// Create a union type that works with both ChatMessage and OptimisticMessage
type AnyMessageType = ChatMessageType | OptimisticMessage;

interface ChatMessageProps {
  chat: AnyMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  isOptimistic?: boolean;
  applied?: boolean;
  retryMessage?: () => void;
}

export function ChatMessage({
  chat,
  setMessage,
  applyChanges,
  isApplying = false,
  isOptimistic = false,
  applied = false,
  retryMessage
}: ChatMessageProps) {
  // Enhanced optimistic message detection
  const isOptimisticUserMessage = isOptimistic || 
    (!!getChatMeta(chat, 'optimistic_id', '') && !chat.ai_response);
  
  // Check if this message has an error
  const hasError = getChatMeta(chat, 'error', false);
  
  // Log chat message for debugging - enhanced with more details
  React.useEffect(() => {
    console.log("[ChatMessage] Message rendered:", {
      id: chat.id,
      timestamp: new Date().toISOString(),
      isOptimistic,
      isOptimisticUserMessage,
      hasError,
      hasAiResponse: !!chat.ai_response,
      hasChangesSuggested: !!(chat as ChatMessageType).changes_suggested,
      userMessagePreview: chat.user_message?.substring(0, 50) + (chat.user_message?.length > 50 ? '...' : ''),
      aiResponseLength: chat.ai_response?.length || 0,
      meta: chat.meta || {},
      applied: applied || !!chat.applied
    });
    
    // Log specific conditions for easier debugging
    if (hasError) {
      console.warn("[ChatMessage] Error detected in message:", {
        id: chat.id,
        errorDetails: chat.meta?.error_details || "No detailed error information"
      });
    }
    
    if (isOptimisticUserMessage) {
      console.log("[ChatMessage] Optimistic message render:", {
        id: chat.id,
        optimisticId: getChatMeta(chat, 'optimistic_id', ''),
        waitingForResponse: true
      });
    }
  }, [chat, isOptimistic, hasError, isOptimisticUserMessage, applied]);
  
  // For optimistic user messages, only show the user message
  if (isOptimisticUserMessage) {
    return (
      <UserMessage 
        message={chat.user_message} 
        isOptimistic={true} 
        isError={hasError}
        onRetry={hasError && retryMessage ? retryMessage : undefined} 
      />
    );
  }

  const handleApplyChanges = async () => {
    console.log("[ChatMessage] Applying changes for message:", {
      id: chat.id,
      hasChangesSuggested: !!(chat as ChatMessageType).changes_suggested,
      timestamp: new Date().toISOString()
    });
    
    try {
      // We need to cast chat to ChatMessageType for applyChanges
      // This is safe because isOptimisticUserMessage would have returned earlier if this was an optimistic message
      const result = await applyChanges(chat as ChatMessageType);
      console.log("[ChatMessage] Apply changes result:", {
        id: chat.id,
        success: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("[ChatMessage] Error applying changes:", {
        id: chat.id,
        error,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-4">
      <UserMessage 
        message={chat.user_message} 
        isOptimistic={isOptimistic} 
        isError={hasError}
        onRetry={hasError && retryMessage ? retryMessage : undefined}
      />
      
      {chat.ai_response && (
        <ChatResponse
          response={chat.ai_response}
          changesSuggested={(chat as ChatMessageType).changes_suggested || null}
          followUpQuestions={(chat as ChatMessageType).follow_up_questions || []}
          setMessage={setMessage}
          onApplyChanges={handleApplyChanges}
          isApplying={isApplying}
          applied={applied || !!chat.applied}
          messageId={chat.id}
        />
      )}
    </div>
  );
}

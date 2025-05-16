
import React from 'react';
import { ChatResponse } from './ChatResponse';
import { UserMessage } from './UserMessage';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import { getChatMeta } from '@/utils/chat-meta';

interface ChatMessageProps {
  chat: ChatMessageType | OptimisticMessage;
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
    (!!getChatMeta(chat, 'optimistic_id', '') && !('ai_response' in chat && chat.ai_response));
  
  // Check if this message has an error
  const hasError = getChatMeta(chat, 'error', false);
  
  // Log chat message for debugging - enhanced with more details
  React.useEffect(() => {
    console.log("[ChatMessage] Message rendered:", {
      id: 'id' in chat ? chat.id : 'unknown',
      timestamp: new Date().toISOString(),
      isOptimistic,
      isOptimisticUserMessage,
      hasError,
      hasAiResponse: 'ai_response' in chat && !!chat.ai_response,
      hasChangesSuggested: 'changes_suggested' in chat && !!chat.changes_suggested,
      userMessagePreview: chat.user_message?.substring(0, 50) + (chat.user_message?.length > 50 ? '...' : ''),
      aiResponseLength: 'ai_response' in chat ? chat.ai_response?.length || 0 : 0,
      meta: chat.meta || {},
      applied: applied || ('applied' in chat && !!chat.applied)
    });
    
    // Log specific conditions for easier debugging
    if (hasError) {
      console.warn("[ChatMessage] Error detected in message:", {
        id: 'id' in chat ? chat.id : 'unknown',
        errorDetails: chat.meta?.error_details || "No detailed error information"
      });
    }
    
    if (isOptimisticUserMessage) {
      console.log("[ChatMessage] Optimistic message render:", {
        id: 'id' in chat ? chat.id : 'unknown',
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

  // Safely check if this is a complete chat message with AI response
  if (!('ai_response' in chat) || !chat.ai_response) {
    // If it doesn't have an AI response but it's not optimistic, render as user message only
    return (
      <UserMessage 
        message={chat.user_message}
        isOptimistic={false}
        isError={hasError}
        onRetry={hasError && retryMessage ? retryMessage : undefined}
      />
    );
  }

  const handleApplyChanges = async () => {
    if (!('id' in chat)) {
      console.error('[ChatMessage] Cannot apply changes for message without id');
      return;
    }
    
    console.log("[ChatMessage] Applying changes for message:", {
      id: chat.id,
      hasChangesSuggested: !!chat.changes_suggested,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Safe type cast since we've verified this is a ChatMessageType with id
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

  // This is definitely a ChatMessageType with ai_response at this point
  const chatWithResponse = chat as ChatMessageType;

  return (
    <div className="space-y-4">
      <UserMessage 
        message={chatWithResponse.user_message} 
        isOptimistic={isOptimistic} 
        isError={hasError}
        onRetry={hasError && retryMessage ? retryMessage : undefined}
      />
      
      <ChatResponse
        response={chatWithResponse.ai_response}
        changesSuggested={chatWithResponse.changes_suggested || null}
        followUpQuestions={chatWithResponse.follow_up_questions || []}
        setMessage={setMessage}
        onApplyChanges={handleApplyChanges}
        isApplying={isApplying}
        applied={applied || !!chatWithResponse.applied}
        messageId={chatWithResponse.id}
      />
    </div>
  );
}

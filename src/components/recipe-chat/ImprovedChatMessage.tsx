
import React from 'react';
import { ChatResponse } from './ChatResponse';
import { UserMessage } from './UserMessage';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { hasChatMeta } from '@/utils/chat-meta';

interface ImprovedChatMessageProps {
  chat: ChatMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  // Receive message state as props instead of accessing store directly
  isPending?: boolean;
  isFailed?: boolean; 
  isApplied?: boolean;
}

export function ImprovedChatMessage({
  chat,
  setMessage,
  applyChanges,
  isApplying = false,
  isPending = false,
  isFailed = false,
  isApplied = false
}: ImprovedChatMessageProps) {
  // Check if this is an optimistic message
  const isOptimistic = !chat.ai_response || 
    hasChatMeta(chat, 'optimistic_id') || 
    isPending;

  // Handle retrying a failed message
  const handleRetry = () => {
    if (isFailed) {
      setMessage(chat.user_message);
    }
  };

  // Render optimistic user message without AI response
  if (isOptimistic) {
    return (
      <UserMessage 
        message={chat.user_message} 
        isOptimistic={true} 
        isFailed={isFailed}
        showRetry={isFailed}
        onRetry={handleRetry}
      />
    );
  }

  // Handle applying changes
  const handleApplyChanges = async () => {
    await applyChanges(chat);
  };

  return (
    <div className="space-y-4">
      <UserMessage message={chat.user_message} />
      
      {chat.ai_response && (
        <ChatResponse
          response={chat.ai_response}
          changesSuggested={chat.changes_suggested || null}
          followUpQuestions={chat.follow_up_questions || []}
          setMessage={setMessage}
          onApplyChanges={handleApplyChanges}
          isApplying={isApplying}
          applied={isApplied || !!chat.applied}
        />
      )}
    </div>
  );
}


import React from 'react';
import { ChatResponse } from './ChatResponse';
import { UserMessage } from './UserMessage';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { hasChatMeta } from '@/utils/chat-meta';

interface ChatMessageProps {
  chat: ChatMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  isOptimistic?: boolean;
  applied?: boolean;
  isFailed?: boolean;
}

export function ChatMessage({
  chat,
  setMessage,
  applyChanges,
  isApplying = false,
  isOptimistic = false,
  applied = false,
  isFailed = false
}: ChatMessageProps) {
  // Render optimistic user message without AI response
  if (isOptimistic || (hasChatMeta(chat, 'optimistic_id') && !chat.ai_response)) {
    return (
      <UserMessage 
        message={chat.user_message} 
        isOptimistic={isOptimistic} 
        isFailed={isFailed}
        showRetry={isFailed}
        onRetry={() => setMessage(chat.user_message)}
      />
    );
  }

  const handleApplyChanges = async () => {
    await applyChanges(chat);
  };

  return (
    <div className="space-y-4">
      <UserMessage 
        message={chat.user_message} 
        isOptimistic={isOptimistic} 
      />
      
      {chat.ai_response && (
        <ChatResponse
          response={chat.ai_response}
          changesSuggested={chat.changes_suggested || null}
          followUpQuestions={chat.follow_up_questions || []}
          setMessage={setMessage}
          onApplyChanges={handleApplyChanges}
          isApplying={isApplying}
          applied={applied || !!chat.applied}
        />
      )}
    </div>
  );
}


import React from 'react';
import { ChatResponse } from './ChatResponse';
import { UserMessage } from './UserMessage';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { getChatMeta } from '@/utils/chat-meta';

interface ChatMessageProps {
  chat: ChatMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessageType) => Promise<boolean>;
  isApplying?: boolean;
  isOptimistic?: boolean;
  applied?: boolean;
}

export function ChatMessage({
  chat,
  setMessage,
  applyChanges,
  isApplying = false,
  isOptimistic = false,
  applied = false
}: ChatMessageProps) {
  // Check if this is an optimistic message without an AI response yet
  const isOptimisticUserMessage = isOptimistic || 
    (!!getChatMeta(chat, 'optimistic_id', '') && !chat.ai_response);
  
  // For optimistic user messages, only show the user message
  if (isOptimisticUserMessage) {
    return (
      <UserMessage message={chat.user_message} isOptimistic={true} />
    );
  }

  const handleApplyChanges = async () => {
    await applyChanges(chat);
  };

  return (
    <div className="space-y-4">
      <UserMessage message={chat.user_message} isOptimistic={isOptimistic} />
      
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

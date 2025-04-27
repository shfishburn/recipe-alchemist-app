
import React from 'react';
import { ChatResponse } from './ChatResponse';
import type { ChatMessage as ChatMessageType } from '@/hooks/use-recipe-chat';

interface ChatMessageProps {
  chat: ChatMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chat: ChatMessageType) => void;
  isApplying: boolean;
}

export function ChatMessage({ chat, setMessage, applyChanges, isApplying }: ChatMessageProps) {
  // Make sure follow_up_questions is always an array
  const followUpQuestions = Array.isArray(chat.follow_up_questions) 
    ? chat.follow_up_questions 
    : [];
    
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] bg-[#9b87f5] text-white px-4 py-2 rounded-[20px] rounded-tr-[5px]">
          <p>{chat.user_message}</p>
        </div>
      </div>

      <div className="flex">
        <ChatResponse
          response={chat.ai_response}
          changesSuggested={chat.changes_suggested}
          followUpQuestions={followUpQuestions}
          setMessage={setMessage}
          onApplyChanges={() => applyChanges(chat)}
          isApplying={isApplying}
          applied={chat.applied}
        />
      </div>
    </div>
  );
}


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
  const parsedFollowUpQuestions = React.useMemo(() => {
    if (!chat.ai_response) return [];
    
    try {
      // First try to parse the response as JSON
      const responseObj = JSON.parse(chat.ai_response);
      return Array.isArray(responseObj.followUpQuestions) 
        ? responseObj.followUpQuestions 
        : [];
    } catch (e) {
      console.log("Could not parse follow-up questions from response:", e);
      return [];
    }
  }, [chat.ai_response]);
    
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="max-w-[85%] bg-[#9b87f5] text-white px-4 py-2 rounded-[20px] rounded-tr-[5px]">
          <p>{chat.user_message}</p>
        </div>
      </div>

      <div className="flex">
        <ChatResponse
          response={chat.ai_response || ""}
          changesSuggested={chat.changes_suggested}
          followUpQuestions={parsedFollowUpQuestions}
          setMessage={setMessage}
          onApplyChanges={() => applyChanges(chat)}
          isApplying={isApplying}
          applied={chat.applied || false}
        />
      </div>
    </div>
  );
}

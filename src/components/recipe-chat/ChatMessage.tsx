
import React, { useEffect, useRef } from 'react';
import { Message } from "@chatscope/chat-ui-kit-react";
import { ChatResponse } from './ChatResponse';
import type { ChatMessage as ChatMessageType } from '@/hooks/use-recipe-chat';
import { parseAIResponse } from './utils/parseAIResponse';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

interface ChatMessageProps {
  chat: ChatMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chat: ChatMessageType) => void;
  isApplying: boolean;
}

export function ChatMessage({ chat, setMessage, applyChanges, isApplying }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const { textResponse, followUpQuestions } = parseAIResponse(chat.ai_response);
  
  // Auto-scroll to new messages
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat.ai_response]);

  return (
    <div ref={messageRef} className="mb-6 animate-fade-in">
      <Message 
        model={{
          message: chat.user_message,
          direction: "outgoing",
          position: "single"
        }}
        className="mb-4 bg-primary text-primary-foreground rounded-lg shadow-sm"
      />

      <ChatResponse
        response={textResponse}
        changesSuggested={chat.changes_suggested}
        followUpQuestions={followUpQuestions}
        setMessage={setMessage}
        onApplyChanges={() => applyChanges(chat)}
        isApplying={isApplying}
        applied={chat.applied}
      />
    </div>
  );
}

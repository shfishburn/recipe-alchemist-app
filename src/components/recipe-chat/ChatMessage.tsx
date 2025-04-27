
import React from 'react';
import { Message } from "@chatscope/chat-ui-kit-react";
import { ChatResponse } from './ChatResponse';
import type { ChatMessage as ChatMessageType } from '@/hooks/use-recipe-chat';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

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

  // Try to parse follow-up questions from the AI response if they exist and aren't already populated
  let parsedFollowUpQuestions = followUpQuestions;
  if (followUpQuestions.length === 0 && chat.ai_response) {
    try {
      const responseObj = JSON.parse(chat.ai_response);
      if (responseObj && Array.isArray(responseObj.followUpQuestions)) {
        parsedFollowUpQuestions = responseObj.followUpQuestions;
      }
    } catch (e) {
      console.log("Could not parse follow-up questions from response");
    }
  }
    
  return (
    <div className="mb-4">
      <Message 
        model={{
          message: chat.user_message,
          direction: "outgoing",
          position: "single"
        }}
        className="mb-4"
      />

      <ChatResponse
        response={chat.ai_response}
        changesSuggested={chat.changes_suggested}
        followUpQuestions={parsedFollowUpQuestions}
        setMessage={setMessage}
        onApplyChanges={() => applyChanges(chat)}
        isApplying={isApplying}
        applied={chat.applied}
      />
    </div>
  );
}

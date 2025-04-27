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
  // Parse the AI response
  let displayText = chat.ai_response;
  let parsedFollowUpQuestions: string[] = [];
  
  try {
    const parsedResponse = JSON.parse(chat.ai_response);
    
    // Extract text response from parsed JSON
    if (parsedResponse && typeof parsedResponse.textResponse === 'string') {
      displayText = parsedResponse.textResponse;
    }
    
    // Extract follow-up questions
    if (Array.isArray(parsedResponse.followUpQuestions)) {
      parsedFollowUpQuestions = parsedResponse.followUpQuestions;
    }
  } catch (e) {
    console.log("Could not parse AI response:", e);
    // Keep the raw response if parsing fails
  }
  
  return (
    <div className="mb-6 animate-fade-in">
      <Message 
        model={{
          message: chat.user_message,
          direction: "outgoing",
          position: "single"
        }}
        className="mb-4 bg-primary text-primary-foreground rounded-lg shadow-sm"
      />

      <ChatResponse
        response={displayText}
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

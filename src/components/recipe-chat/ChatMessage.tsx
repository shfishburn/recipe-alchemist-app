
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatResponse } from './ChatResponse';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  chat: ChatMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chat: ChatMessageType) => void;
  isApplying: boolean;
  isOptimistic?: boolean;
}

export function ChatMessage({ 
  chat, 
  setMessage, 
  applyChanges, 
  isApplying, 
  isOptimistic = false 
}: ChatMessageProps) {
  const handleApplyChanges = () => {
    if (isOptimistic) return; // Don't allow applying changes from optimistic messages
    console.log("Applying changes from chat:", chat.id);
    applyChanges(chat);
  };
  
  // Parse and extract follow-up questions from the response
  const followUpQuestions = React.useMemo(() => {
    if (Array.isArray(chat.follow_up_questions) && chat.follow_up_questions.length > 0) {
      return chat.follow_up_questions;
    }
    
    // Try to extract from JSON response if not provided directly
    if (chat.ai_response && typeof chat.ai_response === 'string') {
      try {
        const responseObj = JSON.parse(chat.ai_response);
        if (responseObj && Array.isArray(responseObj.followUpQuestions)) {
          return responseObj.followUpQuestions;
        }
      } catch (e) {
        // Parsing failed, return empty array
        return [];
      }
    }
    
    return [];
  }, [chat]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border-2 border-primary/25">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="bg-blue-50 rounded-[20px] rounded-tl-[5px] p-4 shadow-sm">
          <p className="text-sm">{chat.user_message}</p>
        </div>
      </div>
      
      {(!isOptimistic && chat.ai_response) ? (
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 bg-primary/10 border-2 border-primary/25">
            <AvatarImage src="/chef-ai.png" alt="Chef AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <ChatResponse 
            response={chat.ai_response}
            changesSuggested={chat.changes_suggested}
            followUpQuestions={followUpQuestions}
            setMessage={setMessage}
            onApplyChanges={handleApplyChanges}
            isApplying={isApplying}
            applied={chat.applied || false}
          />
        </div>
      ) : isOptimistic ? null : (
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 bg-primary/10 border-2 border-primary/25">
            <AvatarImage src="/chef-ai.png" alt="Chef AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="bg-white rounded-[20px] rounded-tl-[5px] p-6 shadow-sm w-full max-w-[calc(100%-60px)]">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )}
    </div>
  );
}

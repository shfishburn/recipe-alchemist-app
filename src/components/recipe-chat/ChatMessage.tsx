
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatResponse } from './ChatResponse';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatMessageProps {
  chat: ChatMessageType;
  setMessage: (message: string) => void;
  applyChanges: (chat: ChatMessageType) => Promise<boolean>;
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
  const isMobile = useIsMobile();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyChanges = () => {
    if (isOptimistic) return; // Don't allow applying changes from optimistic messages
    setLocalError(null);
    
    // Make sure the chat has a recipe ID
    if (!chat.recipe_id) {
      console.error("Cannot apply changes: No recipe_id in chat message", chat);
      setLocalError("Cannot apply changes: Missing recipe information");
      return;
    }
    
    console.log("Applying changes from chat:", chat.id);
    setIsProcessing(true);
    
    // Add timeout to detect stuck operations
    const timeout = setTimeout(() => {
      if (isProcessing) {
        console.warn("Apply changes operation taking too long, may be stuck");
        setLocalError("Operation is taking longer than expected. Please try again.");
        setIsProcessing(false);
      }
    }, 10000);
    
    // Apply the changes
    applyChanges(chat)
      .catch(error => {
        console.error("Error when applying changes:", error);
        setLocalError(error instanceof Error ? error.message : "Failed to apply changes");
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsProcessing(false);
      });
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

  const avatarSize = isMobile ? "h-7 w-7" : "h-10 w-10";
  const messageGap = isMobile ? "gap-2" : "gap-4";

  // Merge local state with props for proper UI display
  const effectiveIsApplying = isApplying || isProcessing;

  return (
    <div className="flex flex-col space-y-2 sm:space-y-4">
      {/* User message */}
      <div className={`flex items-start ${messageGap}`}>
        <Avatar className={`${avatarSize} border-2 border-blue-100 bg-blue-50 shrink-0`}>
          <AvatarFallback className="text-blue-500 font-medium text-xs sm:text-sm">U</AvatarFallback>
        </Avatar>
        <div className="bg-blue-50 rounded-[20px] rounded-tl-[5px] p-2 sm:p-4 shadow-sm">
          <span className="text-xs sm:text-sm text-slate-800">{chat.user_message}</span>
        </div>
      </div>
      
      {/* AI Response */}
      {(!isOptimistic && chat.ai_response) ? (
        <div className={`flex items-start ${messageGap}`}>
          <Avatar className={`${avatarSize} bg-primary/10 border-2 border-primary/25 shrink-0`}>
            <AvatarImage src="/chef-ai.png" alt="Chef AI" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">AI</AvatarFallback>
          </Avatar>
          <div className="flex-1 max-w-[calc(100%-40px)]">
            {localError && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs sm:text-sm">
                {localError}
              </div>
            )}
            <ChatResponse 
              response={chat.ai_response}
              changesSuggested={chat.changes_suggested}
              followUpQuestions={followUpQuestions}
              setMessage={setMessage}
              onApplyChanges={handleApplyChanges}
              isApplying={effectiveIsApplying}
              applied={chat.applied || false}
              isMobile={isMobile}
            />
          </div>
        </div>
      ) : isOptimistic ? null : (
        <div className={`flex items-start ${messageGap}`}>
          <Avatar className={`${avatarSize} bg-primary/10 border-2 border-primary/25 shrink-0`}>
            <AvatarImage src="/chef-ai.png" alt="Chef AI" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">AI</AvatarFallback>
          </Avatar>
          <div className="bg-white rounded-[20px] rounded-tl-[5px] p-3 sm:p-6 shadow-sm w-full max-w-[calc(100%-40px)]">
            <Skeleton className="h-3 sm:h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 sm:h-4 w-full mb-2" />
            <Skeleton className="h-3 sm:h-4 w-1/2" />
          </div>
        </div>
      )}
    </div>
  );
}

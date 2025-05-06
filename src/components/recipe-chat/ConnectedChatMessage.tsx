
import React from 'react';
import { ImprovedChatMessage } from './ImprovedChatMessage';
import type { ChatMessage } from '@/types/chat';
import { useUnifiedChatStore } from '@/store/unified-chat-store';

interface ConnectedChatMessageProps {
  chat: ChatMessage;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessage) => Promise<boolean>;
  isApplying?: boolean;
  onRetry?: () => void;
}

export function ConnectedChatMessage({
  chat,
  setMessage,
  applyChanges,
  isApplying = false,
  onRetry
}: ConnectedChatMessageProps) {
  // Get message state from unified store
  const messageState = useUnifiedChatStore(state => 
    state.messageStates[chat.id || ''] || { pending: false, failed: false, applied: false }
  );
  
  // Handle message retry
  const handleRetry = () => {
    if (messageState.failed && chat.user_message) {
      // Set the message back in the input field
      setMessage(chat.user_message);
      
      // Call the parent retry handler if provided
      if (onRetry) {
        onRetry();
      }
    }
  };
  
  return (
    <ImprovedChatMessage
      chat={chat}
      setMessage={setMessage}
      applyChanges={applyChanges}
      isApplying={isApplying}
      isPending={messageState.pending}
      isFailed={messageState.failed}
      isApplied={messageState.applied}
      onRetry={handleRetry}
    />
  );
}


import React from 'react';
import { ImprovedChatMessage } from './ImprovedChatMessage';
import type { ChatMessage } from '@/types/chat';
import { useChatStore } from '@/store/use-chat-store';

interface ConnectedChatMessageProps {
  chat: ChatMessage;
  setMessage: (message: string) => void;
  applyChanges: (chatMessage: ChatMessage) => Promise<boolean>;
  isApplying?: boolean;
}

export function ConnectedChatMessage({
  chat,
  setMessage,
  applyChanges,
  isApplying = false
}: ConnectedChatMessageProps) {
  // Get message state from store
  const messageState = useChatStore(state => 
    state.messageStates[chat.id || ''] || { pending: false, failed: false, applied: false }
  );
  
  return (
    <ImprovedChatMessage
      chat={chat}
      setMessage={setMessage}
      applyChanges={applyChanges}
      isApplying={isApplying}
      isPending={messageState.pending}
      isFailed={messageState.failed}
      isApplied={messageState.applied}
    />
  );
}

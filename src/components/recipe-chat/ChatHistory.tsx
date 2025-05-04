
import React, { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChangesConfirmationDialog } from './changes/ChangesConfirmationDialog';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import type { Recipe } from '@/types/recipe';

interface ChatHistoryProps {
  chatHistory: ChatMessageType[];
  optimisticMessages: ChatMessageType[];
  isSending: boolean;
  setMessage: (message: string) => void;
  applyChanges: (recipe: Recipe, chatMessage: ChatMessageType) => Promise<void>;
  isApplying: boolean;
  recipe: Recipe;
}

export function ChatHistory({
  chatHistory,
  optimisticMessages,
  isSending,
  setMessage,
  applyChanges,
  isApplying,
  recipe
}: ChatHistoryProps) {
  const [selectedChatMessage, setSelectedChatMessage] = useState<ChatMessageType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Function to open the changes confirmation dialog
  const handleOpenChangesDialog = async (chatMessage: ChatMessageType): Promise<boolean> => {
    setSelectedChatMessage(chatMessage);
    setIsDialogOpen(true);
    return true; // Return a promise that resolves to true to satisfy the type
  };
  
  // Function to handle applying changes
  const handleApplyChanges = async () => {
    if (selectedChatMessage && recipe) {
      await applyChanges(recipe, selectedChatMessage);
    }
  };
  
  // Display all messages
  const allMessages = [...chatHistory, ...optimisticMessages];
  
  return (
    <div className="space-y-4 min-h-[120px]">
      {allMessages.map((message) => (
        <ChatMessage
          key={message.id}
          chat={message}
          setMessage={setMessage}
          applyChanges={handleOpenChangesDialog}
          isApplying={isApplying}
          isOptimistic={optimisticMessages.includes(message)}
        />
      ))}
      
      {/* Show optimistic loading state when sending */}
      {isSending && (
        <div className="animate-pulse">
          <div className="p-4 rounded-lg bg-accent/50">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-20 bg-slate-100 rounded mt-2"></div>
          </div>
        </div>
      )}
      
      {/* Confirmation dialog for applying changes */}
      <ChangesConfirmationDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleApplyChanges}
        changes={selectedChatMessage?.changes_suggested || null}
        isApplying={isApplying}
      />
    </div>
  );
}

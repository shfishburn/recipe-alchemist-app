
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChangesConfirmationDialog } from './changes/ChangesConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import type { Recipe } from '@/types/recipe';
import { getChatMeta } from '@/utils/chat-meta';

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
  const [messageApplyStates, setMessageApplyStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.length, optimisticMessages.length]);
  
  // Function to open the changes confirmation dialog
  const handleOpenChangesDialog = async (chatMessage: ChatMessageType): Promise<boolean> => {
    // Validate changes before showing dialog
    if (!chatMessage.changes_suggested) {
      toast({
        title: "No changes to apply",
        description: "This message doesn't contain any changes to apply.",
        variant: "destructive",
      });
      return false;
    }
    
    setSelectedChatMessage(chatMessage);
    setIsDialogOpen(true);
    return true; // Return a promise that resolves to true to satisfy the type
  };
  
  // Function to handle applying changes
  const handleApplyChanges = async () => {
    if (!selectedChatMessage || !recipe) {
      toast({
        title: "Error",
        description: "Missing data required to apply changes.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Track which message we're applying changes from
      if (selectedChatMessage.id) {
        setMessageApplyStates({
          ...messageApplyStates,
          [selectedChatMessage.id]: true
        });
      }
      
      await applyChanges(recipe, selectedChatMessage);
      
    } catch (error) {
      console.error("Error applying changes:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to apply changes",
        variant: "destructive",
      });
    }
  };
  
  // Display all messages
  const allMessages = [...chatHistory, ...optimisticMessages];
  
  // Check if a message has been applied
  const isMessageApplied = (message: ChatMessageType) => {
    return message.applied || (message.id && messageApplyStates[message.id]);
  };
  
  // Match up optimistic messages with their final versions
  const messageIdMap = chatHistory.reduce<Record<string, boolean>>((acc, msg) => {
    const optimisticId = getChatMeta(msg, 'optimistic_id', '');
    if (optimisticId) {
      acc[optimisticId] = true;
    }
    return acc;
  }, {});
  
  // Filter out optimistic messages that have been replaced by real ones
  const filteredOptimisticMessages = optimisticMessages.filter(msg => {
    const msgId = getChatMeta(msg, 'optimistic_id', '') || msg.id;
    return !messageIdMap[msgId as string];
  });
  
  // Combine filtered messages
  const displayMessages = [...chatHistory, ...filteredOptimisticMessages];
  
  return (
    <div className="space-y-4 min-h-[120px]">
      {displayMessages.map((message, index) => (
        <ChatMessage
          key={message.id || `optimistic-${index}`}
          chat={message}
          setMessage={setMessage}
          applyChanges={handleOpenChangesDialog}
          isApplying={isApplying && selectedChatMessage?.id === message.id}
          applied={isMessageApplied(message)}
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
      
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
      
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

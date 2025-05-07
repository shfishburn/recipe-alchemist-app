
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuickRecipeChat } from '@/hooks/use-quick-recipe-chat';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { RecipeChatInput } from '@/components/recipe-chat/RecipeChatInput';
import { ChatHistory } from '@/components/recipe-chat/ChatHistory';
import { EmptyChatState } from '@/components/recipe-chat/EmptyChatState';
import { ChatHeader } from '@/components/recipe-chat/ChatHeader';
import { ChatLoading } from '@/components/recipe-chat/ChatLoading';
import { ClearChatDialog } from '@/components/recipe-chat/ClearChatDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function QuickRecipeChat({ recipe }: { recipe: QuickRecipe }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    message,
    setMessage,
    chatHistory,
    optimisticMessages,
    isLoadingHistory,
    sendMessage,
    isSending,
    applyChanges,
    isApplying,
    clearChatHistory,
  } = useQuickRecipeChat(recipe);

  // Auto-scroll to bottom when new messages arrive or when sending a message
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory.length, optimisticMessages.length, isSending]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  const handleSubmit = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      sendMessage();
      // Immediately scroll down when sending
      setTimeout(scrollToBottom, 50);
    }
  };
  
  const handleClearChat = () => {
    setIsDialogOpen(true);
  };
  
  const confirmClearChat = async () => {
    await clearChatHistory();
    setIsDialogOpen(false);
  };

  if (isLoadingHistory) {
    return <ChatLoading />;
  }

  // Check if we should show the empty state
  const showEmptyState = chatHistory.length === 0 && optimisticMessages.length === 0;

  return (
    <Card className="bg-white border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className="pt-2 sm:pt-4 px-3 sm:px-5 border-b">
            <ChatHeader 
              hasChatHistory={chatHistory.length > 0} 
              onClearChat={handleClearChat} 
            />
          </div>
          
          <div className="flex-grow overflow-hidden relative">
            <ScrollArea 
              className="h-[calc(100vh-200px)] sm:h-[60vh] px-3 sm:px-5"
              ref={scrollAreaRef}
            >
              {/* Show EmptyChatState if there are no messages */}
              {showEmptyState ? (
                <EmptyChatState />
              ) : (
                <div className="py-3">
                  <ChatHistory
                    chatHistory={chatHistory}
                    optimisticMessages={optimisticMessages}
                    isSending={isSending}
                    setMessage={setMessage}
                    applyChanges={applyChanges}
                    isApplying={isApplying}
                    recipe={recipe as any} // Cast to Recipe type for compatibility
                  />
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="sticky bottom-0 bg-white border-t pt-2 pb-3 px-3 sm:px-5 mt-auto z-10">
            <RecipeChatInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSubmit}
              isSending={isSending}
              // We're not supporting image upload for quick recipes in this version
            />
          </div>
        </div>
      </CardContent>
      
      <ClearChatDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmClearChat}
      />
    </Card>
  );
}

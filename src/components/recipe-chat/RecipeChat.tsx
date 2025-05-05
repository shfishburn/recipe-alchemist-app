
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import type { Recipe } from '@/types/recipe';
import { RecipeChatInput } from './RecipeChatInput';
import { ChatHistory } from './ChatHistory';
import { EmptyChatState } from './EmptyChatState';
import { ChatHeader } from './ChatHeader';
import { ChatLoading } from './ChatLoading';
import { ClearChatDialog } from './ClearChatDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RecipeChat({ recipe }: { recipe: Recipe }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
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
    uploadRecipeImage,
    submitRecipeUrl,
    clearChatHistory,
  } = useRecipeChat(recipe);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        setTimeout(() => {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }, 100);
      }
    }
  }, [chatHistory.length, optimisticMessages.length, isSending]);

  const handleUpload = async (file: File) => {
    uploadRecipeImage(file);
  };

  const handleUrlSubmit = (url: string) => {
    submitRecipeUrl(url);
  };

  const handleSubmit = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      sendMessage();
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
          
          <div className="flex-grow overflow-hidden" ref={scrollAreaRef}>
            <ScrollArea className="h-[calc(100%-60px)] max-h-[60vh] pt-3 px-3 sm:px-5">
              {/* Show EmptyChatState if there are no messages */}
              {showEmptyState ? (
                <EmptyChatState />
              ) : (
                <ChatHistory
                  chatHistory={chatHistory}
                  optimisticMessages={optimisticMessages}
                  isSending={isSending}
                  setMessage={setMessage}
                  applyChanges={applyChanges}
                  isApplying={isApplying}
                  recipe={recipe}
                />
              )}
            </ScrollArea>
          </div>

          <div className="sticky bottom-0 bg-white border-t pt-2 pb-3 px-3 sm:px-5 mt-auto">
            <RecipeChatInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSubmit}
              isSending={isSending}
              onUpload={handleUpload}
              onUrlSubmit={handleUrlSubmit}
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

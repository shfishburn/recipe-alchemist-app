
import React, { useState } from 'react';
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
    <Card className="bg-white border-slate-100 shadow-sm overflow-hidden">
      <CardContent className="pt-2 sm:pt-4 px-3 sm:px-5 pb-4">
        <div className="space-y-3 sm:space-y-4">
          <ChatHeader 
            hasChatHistory={chatHistory.length > 0} 
            onClearChat={handleClearChat} 
          />
          
          <ScrollArea className="h-[calc(100%-120px)] max-h-[60vh] pr-1">
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

          <RecipeChatInput
            message={message}
            setMessage={setMessage}
            onSubmit={handleSubmit}
            isSending={isSending}
            onUpload={handleUpload}
            onUrlSubmit={handleUrlSubmit}
          />
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


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
    <Card className="bg-[#F9FAFB] border-slate-100 shadow-sm">
      <CardContent className="pt-2 sm:pt-6 px-2 sm:px-6">
        <div className="space-y-3 sm:space-y-6">
          <ChatHeader 
            hasChatHistory={chatHistory.length > 0} 
            onClearChat={handleClearChat} 
          />
          
          {/* Only show EmptyChatState here, removed from ChatHistory */}
          {showEmptyState && <EmptyChatState />}
          
          <ChatHistory
            chatHistory={chatHistory}
            optimisticMessages={optimisticMessages}
            isSending={isSending}
            setMessage={setMessage}
            applyChanges={applyChanges.mutate}
            isApplying={isApplying}
          />

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

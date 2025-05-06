
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recipe } from '@/types/recipe';
import { RecipeChatInput } from './RecipeChatInput';
import { ImprovedChatHistory } from './ImprovedChatHistory';
import { ChatHeader } from './ChatHeader';
import { ChatSkeleton } from './ChatSkeleton';
import { ClearChatDialog } from './ClearChatDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUnifiedRecipeChat } from '@/hooks/use-unified-recipe-chat';

export function RecipeChat({ recipe }: { recipe: Recipe }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    message,
    setMessage,
    messages,
    optimisticMessages,
    messageStates,
    isLoadingMessages,
    isSending,
    sendMessage,
    applyChanges,
    isApplying,
    uploadRecipeImage,
    submitRecipeUrl,
    clearChatHistory,
  } = useUnifiedRecipeChat(recipe);

  const handleUpload = async (file: File) => {
    await uploadRecipeImage(file);
  };

  const handleUrlSubmit = (url: string) => {
    submitRecipeUrl(url);
  };

  const handleSubmit = () => {
    if (message.trim()) {
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

  if (isLoadingMessages) {
    return <ChatSkeleton />;
  }

  return (
    <Card className="bg-white border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className="pt-2 sm:pt-4 px-3 sm:px-5 border-b">
            <ChatHeader 
              hasChatHistory={messages.length > 0} 
              onClearChat={handleClearChat} 
            />
          </div>
          
          <div className="flex-grow overflow-hidden relative">
            <ScrollArea 
              className="h-[calc(100vh-200px)] sm:h-[60vh] px-3 sm:px-5"
              ref={scrollAreaRef}
            >
              <div className="py-3">
                <ImprovedChatHistory
                  chatHistory={messages}
                  optimisticMessages={optimisticMessages}
                  isSending={isSending}
                  setMessage={setMessage}
                  applyChanges={applyChanges}
                  isApplying={isApplying}
                  recipe={recipe}
                  messageStates={messageStates}
                  onRetry={handleSubmit}
                />
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          <div className="sticky bottom-0 bg-white border-t pt-2 pb-3 px-3 sm:px-5 mt-auto z-10">
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

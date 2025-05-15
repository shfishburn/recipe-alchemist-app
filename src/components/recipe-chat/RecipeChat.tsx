
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import { useAuth } from '@/hooks/use-auth';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import type { Recipe } from '@/types/recipe';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { RecipeChatInput } from './RecipeChatInput';
import { ChatHistory } from './ChatHistory';
import { EmptyChatState } from './EmptyChatState';
import { ChatHeader } from './ChatHeader';
import { ChatLoading } from './ChatLoading';
import { ClearChatDialog } from './ClearChatDialog';
import { AuthOverlay } from './AuthOverlay';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RecipeChat({ recipe }: { recipe: Recipe }) {
  const { user, session } = useAuth();
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
    applyChanges: rawApplyChanges,
    isApplying,
    uploadRecipeImage,
    submitRecipeUrl,
    clearChatHistory,
    retryMessage,
    uploadProgress,
    isUploading
  } = useRecipeChat(recipe);

  // Create a wrapper for applyChanges that only takes the chatMessage parameter
  const applyChanges = async (chatMessage: ChatMessageType) => {
    return await rawApplyChanges(recipe, chatMessage);
  };

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

  const handleUpload = async (file: File) => {
    uploadRecipeImage(file);
  };

  const handleUrlSubmit = (url: string) => {
    submitRecipeUrl(url);
  };

  const handleSubmit = () => {
    if (!session) {
      // Store the intent to chat in the auth state manager
      authStateManager.queueAction({
        type: 'other',
        data: { recipeId: recipe.id },
        sourceUrl: window.location.pathname
      });
      return;
    }
    
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
  
  const handleLogin = () => {
    // Store the intent to return to this recipe
    authStateManager.setRedirectAfterAuth(window.location.pathname);
    // Navigate to auth page (you'll need to update this based on your routing)
    window.location.href = '/auth';
  };

  if (isLoadingHistory) {
    return <ChatLoading />;
  }
  
  // Show auth overlay when user is not authenticated
  if (!user || !session) {
    return <AuthOverlay onLogin={handleLogin} />;
  }

  // Check if we should show the empty state
  const showEmptyState = chatHistory.length === 0 && optimisticMessages.length === 0;

  return (
    <Card className="bg-white border-slate-100 shadow-sm overflow-hidden flex flex-col h-full hw-boost">
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
                    recipe={recipe}
                    retryMessage={retryMessage}
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
              onUpload={handleUpload}
              onUrlSubmit={handleUrlSubmit}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
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

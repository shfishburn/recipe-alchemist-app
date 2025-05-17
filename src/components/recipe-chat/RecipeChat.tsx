
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import { useAuth } from '@/hooks/use-auth';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import type { QuickRecipe } from '@/types/quick-recipe';
import type { ChatMessage } from '@/types/chat';
import { RecipeChatInput } from './RecipeChatInput';
import { ChatHistory } from './ChatHistory';
import { EmptyChatState } from './EmptyChatState';
import { ChatHeader } from './ChatHeader';
import { ChatLoading } from './ChatLoading';
import { ClearChatDialog } from './ClearChatDialog';
import { AuthOverlay } from './AuthOverlay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { ChatLayout } from './ChatLayout';

export function RecipeChat({ recipe }: { recipe: QuickRecipe }) {
  const { user, session } = useAuth();
  const { handleError } = useErrorHandler({
    toastTitle: "Chat Error",
    toastDuration: 6000
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
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
    isUploading,
    refetchChatHistory
  } = useRecipeChat(recipe);

  // Create a wrapper for applyChanges to match the function signature expected by ChatMessage
  const handleApplyChanges = async (chatMessage: ChatMessage): Promise<boolean> => {
    try {
      return await rawApplyChanges(recipe, chatMessage);
    } catch (error) {
      handleError(error);
      toast.error("Changes couldn't be applied", {
        description: "Please try again or modify your request",
        action: {
          label: "Retry",
          onClick: () => handleApplyChanges(chatMessage),
        },
      });
      return false;
    }
  };

  // Auto-scroll to bottom when new messages arrive or when sending a message
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory.length, optimisticMessages.length, isSending]);

  // Enhanced scroll to bottom with fallbacks
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } catch (e) {
        // Fallback for browsers that don't support smooth scrolling
        messagesEndRef.current.scrollIntoView();
      }
    } else if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadRecipeImage(file);
    } catch (error) {
      handleError(error);
      toast.error("Upload failed", {
        description: (
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span>Please try again with a smaller image or different format</span>
          </div>
        ),
        duration: 5000,
      });
    }
  };

  const handleUrlSubmit = (url: string) => {
    try {
      submitRecipeUrl(url);
    } catch (error) {
      handleError(error);
      toast.error("URL submission failed", {
        description: "Please check the URL and try again",
        duration: 5000,
      });
    }
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
      try {
        console.log("Sending message:", message);
        sendMessage();
        // Immediately scroll down when sending
        setTimeout(scrollToBottom, 50);
      } catch (error) {
        handleError(error);
        toast.error("Failed to send message", {
          description: "Please try again",
          action: {
            label: "Retry",
            onClick: handleSubmit,
          },
        });
      }
    }
  };
  
  const handleClearChat = () => {
    setIsDialogOpen(true);
  };
  
  const confirmClearChat = async () => {
    try {
      await clearChatHistory();
      setIsDialogOpen(false);
    } catch (error) {
      handleError(error);
      toast.error("Failed to clear chat history", {
        description: "Please try again",
        action: {
          label: "Retry",
          onClick: confirmClearChat,
        },
      });
    }
  };
  
  const handleLogin = () => {
    // Store the intent to return to this recipe
    authStateManager.setRedirectAfterAuth(window.location.pathname);
    // Navigate to auth page
    window.location.href = '/auth';
  };

  // Enhanced retry mechanism with exponential backoff
  const handleRetryLoadHistory = async () => {
    const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);
    setRetryCount(prev => prev + 1);
    
    toast.info("Retrying...", {
      description: `Attempt ${retryCount + 1}`,
      duration: backoffDelay,
    });
    
    setTimeout(async () => {
      try {
        await refetchChatHistory();
      } catch (error) {
        handleError(error);
        if (retryCount < 3) {
          toast.info("Still having trouble", {
            description: "We'll try again shortly",
            duration: 3000,
          });
        } else {
          toast.error("Connection issues", {
            description: "Please check your network or try again later",
            duration: 8000,
          });
        }
      }
    }, backoffDelay);
  };

  if (isLoadingHistory) {
    return <ChatLoading onRetry={handleRetryLoadHistory} retryCount={retryCount} />;
  }
  
  // Show auth overlay when user is not authenticated
  if (!user || !session) {
    return <AuthOverlay onLogin={handleLogin} />;
  }

  // Check if we should show the empty state
  const showEmptyState = chatHistory.length === 0 && optimisticMessages.length === 0;

  return (
    <ChatLayout>
      <Card className="flex flex-col h-full w-full overflow-hidden bg-white border-slate-100 shadow-sm hw-boost">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 pt-2 sm:pt-4 px-3 sm:px-5 border-b">
              <ChatHeader 
                hasChatHistory={chatHistory.length > 0} 
                onClearChat={handleClearChat} 
              />
            </div>
            
            <div className="flex-1 min-h-0 relative overflow-hidden">
              <ScrollArea 
                className="h-full px-3 sm:px-5 scroll-momentum hw-accelerated-scroll" 
                ref={scrollAreaRef}
              >
                <div className="py-3">
                  {/* Show EmptyChatState if there are no messages */}
                  {showEmptyState ? (
                    <EmptyChatState />
                  ) : (
                    <div>
                      <ChatHistory
                        chatHistory={chatHistory}
                        optimisticMessages={optimisticMessages}
                        isSending={isSending}
                        setMessage={setMessage}
                        applyChanges={handleApplyChanges}
                        isApplying={isApplying}
                        recipe={recipe}
                        retryMessage={retryMessage}
                      />
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex-shrink-0 border-t pt-2 pb-3 px-3 sm:px-5 bg-white z-10">
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
    </ChatLayout>
  );
}

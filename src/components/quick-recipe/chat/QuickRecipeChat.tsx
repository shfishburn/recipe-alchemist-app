
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
import { useToast } from '@/hooks/use-toast';

export function QuickRecipeChat({ recipe }: { recipe: QuickRecipe }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
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

  // Improved error handling for optimistic messages
  const [failedMessageIds, setFailedMessageIds] = useState<string[]>([]);

  // Auto-scroll to bottom when new messages arrive or when sending a message
  useEffect(() => {
    if (chatHistory.length > 0 || optimisticMessages.length > 0 || isSending) {
      // Use setTimeout to ensure DOM has updated before scrolling
      setTimeout(scrollToBottom, 100);
    }
  }, [chatHistory.length, optimisticMessages.length, isSending]);
  
  // Reset scroll position when opening the chat
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Improved scroll function with fallbacks
  const scrollToBottom = () => {
    // Try scrolling to the messages end marker first
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end' 
        });
        return;
      } catch (err) {
        console.error("Error using scrollIntoView:", err);
      }
    }
    
    // Fall back to scroll area if available
    if (scrollAreaRef.current) {
      try {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
          return;
        }
      } catch (err) {
        console.error("Error scrolling viewport:", err);
      }
    }
    
    // Last resort: use document scrolling
    try {
      window.scrollTo(0, document.body.scrollHeight);
    } catch (err) {
      console.error("Error with window.scrollTo:", err);
    }
  };

  // Enhanced message submission with better error handling
  const handleSubmit = async () => {
    if (message.trim() && !isSending) {
      const currentMessage = message.trim();
      
      try {
        await sendMessage();
        // Scroll immediately after sending for better UX
        setTimeout(scrollToBottom, 50);
        setTimeout(scrollToBottom, 300); // Try again after a short delay
      } catch (error) {
        console.error("Failed to send message:", error);
        toast({
          title: "Message failed to send",
          description: "Please check your connection and try again",
          variant: "destructive"
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
      setFailedMessageIds([]);
      toast({
        title: "Chat cleared",
        description: "All messages have been removed"
      });
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast({
        title: "Failed to clear chat",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  // Show loading state while retrieving chat history
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
              className="h-[calc(100vh-220px)] sm:h-[60vh] px-3 sm:px-5 overflow-y-auto"
              ref={scrollAreaRef}
            >
              {/* Show EmptyChatState if there are no messages */}
              {showEmptyState ? (
                <EmptyChatState />
              ) : (
                <div className="py-3 flex flex-col space-y-6">
                  <ChatHistory
                    chatHistory={chatHistory}
                    optimisticMessages={optimisticMessages}
                    isSending={isSending}
                    setMessage={setMessage}
                    applyChanges={applyChanges}
                    isApplying={isApplying}
                    recipe={recipe as any} // Cast to Recipe type for compatibility
                    failedMessageIds={failedMessageIds}
                  />
                  <div ref={messagesEndRef} className="h-4" />
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

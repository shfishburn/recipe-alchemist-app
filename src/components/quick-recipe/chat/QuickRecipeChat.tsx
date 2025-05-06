
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';
import { RecipeChatInput } from '@/components/recipe-chat/RecipeChatInput';
import { ImprovedChatHistory } from '@/components/recipe-chat/ImprovedChatHistory';
import { ChatHeader } from '@/components/recipe-chat/ChatHeader';
import { ClearChatDialog } from '@/components/recipe-chat/ClearChatDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { useUnifiedRecipeChat } from '@/hooks/use-unified-recipe-chat';

export function QuickRecipeChat({ recipe }: { recipe: QuickRecipe }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
    clearChatHistory,
    fetchChatHistory
  } = useUnifiedRecipeChat(recipe);
  
  // Load chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  // Auto-scroll to bottom when new messages arrive or when sending a message
  useEffect(() => {
    if (messages.length > 0 || optimisticMessages.length > 0 || isSending) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length, optimisticMessages.length, isSending]);
  
  // Reset scroll position when opening the chat
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Improved scroll function with fallbacks
  const scrollToBottom = () => {
    // Try using message end ref first
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
    
    // Try using scroll area viewport
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
  };

  const handleSubmit = async () => {
    if (message.trim() && !isSending) {
      try {
        await sendMessage();
        // Scroll after sending
        setTimeout(scrollToBottom, 50);
        setTimeout(scrollToBottom, 300); // Try again after a delay
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

  // Check if we should show the empty state
  const showEmptyState = messages.length === 0 && optimisticMessages.length === 0;
  
  // Calculate height based on device
  const chatHeight = isMobile ? 'calc(90vh - 160px)' : '60vh';

  return (
    <Card className="bg-white border-slate-100 shadow-sm overflow-hidden flex flex-col h-full w-full">
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
              className={`h-[${chatHeight}] px-3 sm:px-5 overflow-y-auto`}
              ref={scrollAreaRef}
            >
              <div className="py-3 flex flex-col space-y-6">
                <ImprovedChatHistory
                  chatHistory={messages}
                  optimisticMessages={optimisticMessages}
                  isSending={isSending}
                  setMessage={setMessage}
                  applyChanges={applyChanges}
                  isApplying={isApplying}
                  recipe={recipe as any} // Cast to Recipe type for compatibility
                  messageStates={messageStates}
                />
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </ScrollArea>
          </div>

          <div className="sticky bottom-0 bg-white border-t pt-2 pb-3 px-3 sm:px-5 mt-auto z-10">
            <RecipeChatInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSubmit}
              isSending={isSending}
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

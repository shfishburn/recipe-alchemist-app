
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import type { Recipe } from '@/types/recipe';
import { RecipeChatInput } from './RecipeChatInput';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RecipeChat({ recipe }: { recipe: Recipe }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
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

  // Debug logging to help trace any issues with chat responses
  useEffect(() => {
    if (chatHistory.length > 0) {
      console.log("Chat history loaded:", 
        chatHistory.map(chat => ({
          id: chat.id,
          message: chat.user_message.substring(0, 20) + '...',
          hasResponse: !!chat.ai_response,
          responsePreview: chat.ai_response ? chat.ai_response.substring(0, 20) + '...' : 'No response',
          hasSuggestions: !!chat.changes_suggested
        }))
      );
    }
  }, [chatHistory]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, optimisticMessages]);

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
    return (
      <Card className="border-slate-100">
        <CardContent className="pt-2 sm:pt-6">
          <div className="flex justify-center p-4 sm:p-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#F9FAFB] border-slate-100 shadow-sm">
      <CardContent className="pt-2 sm:pt-6 px-2 sm:px-6">
        <div className="space-y-3 sm:space-y-6">
          <div className="flex justify-between items-center">
            {chatHistory.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearChat}
                className="text-xs sm:text-sm"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Clear Chat
              </Button>
            )}
          </div>
          
          {chatHistory.length === 0 && optimisticMessages.length === 0 && (
            <div className="text-center py-4 sm:py-8 bg-white/60 rounded-lg border border-slate-100 shadow-sm">
              <p className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-4">
                Ask for cooking techniques, scientific insights, or modifications!
                You can also upload a recipe image or paste a URL.
              </p>
            </div>
          )}
          
          <div className="space-y-3 sm:space-y-6">
            {/* Render confirmed chat messages */}
            {chatHistory.map((chat) => (
              <ChatMessage
                key={chat.id}
                chat={chat}
                setMessage={setMessage}
                applyChanges={applyChanges.mutate}
                isApplying={isApplying}
              />
            ))}
            
            {/* Render optimistic messages that haven't been confirmed yet */}
            {optimisticMessages.map((chat, index) => (
              <div key={`optimistic-${index}`} className="opacity-90">
                <ChatMessage
                  chat={chat}
                  setMessage={setMessage}
                  applyChanges={applyChanges.mutate}
                  isApplying={isApplying}
                  isOptimistic={true}
                />
              </div>
            ))}
            
            {/* Show processing indicator when sending */}
            {isSending && (
              <div className="flex justify-start pl-8 sm:pl-14 mt-1 sm:mt-2">
                <ChatProcessingIndicator stage="analyzing" />
              </div>
            )}
            
            {/* Invisible element for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

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
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all chat messages for this recipe. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearChat}>Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

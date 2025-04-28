
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import type { Recipe } from '@/types/recipe';
import { RecipeChatInput } from './RecipeChatInput';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';
import type { OptimisticMessage } from '@/types/chat';

export function RecipeChat({ recipe }: { recipe: Recipe }) {
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
    uploadRecipeImage,
    submitRecipeUrl,
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

  if (isLoadingHistory) {
    return (
      <Card className="border-slate-100">
        <CardContent className="pt-6">
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#F9FAFB] border-slate-100 shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {chatHistory.length === 0 && optimisticMessages.length === 0 && (
            <div className="text-center py-8 bg-white/60 rounded-lg border border-slate-100 shadow-sm">
              <p className="text-muted-foreground px-4">
                Ask for cooking techniques, scientific insights, or modifications!
                You can also upload a recipe image or paste a URL.
              </p>
            </div>
          )}
          
          <div className="space-y-6">
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
              <div className="flex justify-start pl-14 mt-2">
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
    </Card>
  );
}

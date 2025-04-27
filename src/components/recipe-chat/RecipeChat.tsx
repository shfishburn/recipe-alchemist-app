
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import type { Recipe } from '@/types/recipe';
import { RecipeChatInput } from './RecipeChatInput';
import { ChatMessage } from './ChatMessage';
import { ChatProcessingIndicator } from './ChatProcessingIndicator';

export function RecipeChat({ recipe }: { recipe: Recipe }) {
  const {
    message,
    setMessage,
    chatHistory,
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
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#F1F0FB]">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {chatHistory.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Ask for cooking techniques, scientific insights, or modifications!
                You can also upload a recipe image or paste a URL.
              </p>
            </div>
          )}
          
          <div className="space-y-6">
            {chatHistory.map((chat) => (
              <ChatMessage
                key={chat.id}
                chat={chat}
                setMessage={setMessage}
                applyChanges={applyChanges.mutate}
                isApplying={isApplying}
              />
            ))}
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

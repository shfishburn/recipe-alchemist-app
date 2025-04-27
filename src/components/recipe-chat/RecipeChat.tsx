
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import type { Recipe } from '@/hooks/use-recipe-detail';

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
  } = useRecipeChat(recipe);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage();
    }
  };

  const renderFormattedResponse = (response: string) => {
    // Convert text to formatted HTML with better parsing
    const paragraphs = response.split('\n\n');
    return paragraphs.map((para, index) => {
      // Check if paragraph starts with bullet points
      if (para.startsWith('- ') || para.startsWith('•')) {
        const bulletItems = para.split('\n').map((item, idx) => (
          <li key={idx} className="list-disc list-inside">{item.replace(/^[-•]\s*/, '')}</li>
        ));
        return <ul key={index} className="pl-4 space-y-2">{bulletItems}</ul>;
      }
      return <p key={index} className="mb-4">{para}</p>;
    });
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
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <div key={chat.id} className="space-y-4">
              {index > 0 && <Separator />}
              
              {/* User Message */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="font-medium">You</p>
                  <p className="text-muted-foreground">{chat.user_message}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="font-medium">Chef AI</p>
                  <div className="text-muted-foreground">
                    {renderFormattedResponse(chat.ai_response)}
                  </div>
                  
                  {/* Follow-up Questions */}
                  {chat.follow_up_questions && chat.follow_up_questions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold">Follow-up Questions:</p>
                      {chat.follow_up_questions.map((question, qIndex) => (
                        <Button 
                          key={qIndex} 
                          variant="outline" 
                          size="sm" 
                          className="mr-2 mb-2"
                          onClick={() => {
                            setMessage(question);
                            // Optional: automatically send the follow-up question
                            // sendMessage();
                          }}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {chat.changes_suggested && !chat.applied && (
                    <div className="mt-4">
                      <Button
                        onClick={() => applyChanges.mutate(chat)}
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Apply Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  {chat.applied && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ✓ Changes applied
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask for recipe modifications..."
                className="flex-1"
                rows={2}
              />
              <Button type="submit" disabled={isSending || !message.trim()}>
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

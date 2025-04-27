
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
    // Split into sections based on newlines
    const sections = response.split('\n\n');
    
    return sections.map((section, sectionIndex) => {
      // Check if section is a heading (ends with ':')
      if (section.trim().endsWith(':')) {
        return (
          <h3 key={sectionIndex} className="font-semibold text-lg mt-4 mb-2">
            {section}
          </h3>
        );
      }
      
      // Handle bullet points
      if (section.includes('\n•') || section.includes('\n-')) {
        const items = section.split('\n').filter(item => item.trim());
        return (
          <ul key={sectionIndex} className="space-y-2 mb-4">
            {items.map((item, idx) => (
              <li key={idx} className={item.startsWith('•') || item.startsWith('-') ? 'list-disc ml-6' : ''}>
                {item.replace(/^[•-]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Handle nutritional comparison tables
      if (section.toLowerCase().includes('nutrition') && section.includes('|')) {
        const rows = section.split('\n');
        return (
          <div key={sectionIndex} className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {rows.map((row, idx) => {
                  const cells = row.split('|').map(cell => cell.trim());
                  return (
                    <tr key={idx}>
                      {cells.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2 whitespace-nowrap text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      // Regular paragraphs
      return <p key={sectionIndex} className="mb-4">{section}</p>;
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
                  <div className="text-muted-foreground prose prose-sm max-w-none">
                    {renderFormattedResponse(chat.ai_response)}
                  </div>
                  
                  {/* Nutritional Changes */}
                  {chat.changes_suggested?.nutrition && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Nutritional Impact:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(chat.changes_suggested.nutrition).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Follow-up Questions */}
                  {chat.follow_up_questions && chat.follow_up_questions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold">Follow-up Questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {chat.follow_up_questions.map((question, qIndex) => (
                          <Button 
                            key={qIndex} 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setMessage(question);
                            }}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Apply Changes Button */}
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

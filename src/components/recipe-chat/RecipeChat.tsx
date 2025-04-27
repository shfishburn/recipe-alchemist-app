
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import type { Recipe } from '@/hooks/use-recipe-detail';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

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
    if (!response) return null;
    
    // Split into sections based on headings (lines ending with colon)
    const sections = [];
    let currentSection = { heading: '', content: [] };
    
    response.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if line is a heading (ends with ':')
      if (trimmedLine.endsWith(':') && !trimmedLine.includes('\u2022') && !trimmedLine.includes('-')) {
        // Save previous section if it exists
        if (currentSection.content.length > 0 || currentSection.heading) {
          sections.push({...currentSection});
        }
        // Start new section
        currentSection = { 
          heading: trimmedLine, 
          content: []
        };
      } else if (trimmedLine) {
        // Add content to current section
        currentSection.content.push(trimmedLine);
      }
    });
    
    // Add the last section
    if (currentSection.content.length > 0 || currentSection.heading) {
      sections.push(currentSection);
    }
    
    return (
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {section.heading && (
              <h3 className="font-semibold text-base">{section.heading}</h3>
            )}
            
            {section.content.map((paragraph, pIdx) => {
              // Handle bullet points
              if (paragraph.startsWith('\u2022') || paragraph.startsWith('-')) {
                const bulletItems = section.content
                  .filter(line => line.startsWith('\u2022') || line.startsWith('-'))
                  .map(line => line.replace(/^[\u2022-]\s*/, ''));
                  
                return pIdx === section.content.indexOf(paragraph) ? (
                  <ul key={pIdx} className="list-disc list-outside ml-5 space-y-1">
                    {bulletItems.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                ) : null; // Only render the bullet list once
              }
              
              // Handle regular paragraphs (not bullet points)
              if (!paragraph.startsWith('\u2022') && !paragraph.startsWith('-')) {
                return <p key={pIdx} className="text-sm text-muted-foreground">{paragraph}</p>;
              }
              
              return null;
            })}
          </div>
        ))}
      </div>
    );
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
          {chatHistory.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Ask for cooking tips or recipe modifications!</p>
            </div>
          )}
          
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
                  {chat.changes_suggested?.nutrition && Object.keys(chat.changes_suggested.nutrition).length > 0 && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Nutritional Impact:</h4>
                      <Table>
                        <TableBody>
                          {Object.entries(chat.changes_suggested.nutrition).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="py-1 px-2 capitalize font-medium">{key.replace(/_/g, ' ')}</TableCell>
                              <TableCell className="py-1 px-2 text-right">{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* Health Insights */}
                  {chat.changes_suggested?.health_insights && chat.changes_suggested.health_insights.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {chat.changes_suggested.health_insights.map((insight, i) => (
                        <Badge key={i} variant="secondary">{insight}</Badge>
                      ))}
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
                        className="gap-2"
                      >
                        {isApplying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Apply Changes
                      </Button>
                    </div>
                  )}
                  
                  {chat.applied && (
                    <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Changes applied
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

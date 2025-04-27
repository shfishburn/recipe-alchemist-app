import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, Beaker, ChefHat } from 'lucide-react';
import { useRecipeChat } from '@/hooks/use-recipe-chat';
import type { Recipe } from '@/hooks/use-recipe-detail';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { RecipeChatInput } from './RecipeChatInput';
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

  const handleUpload = async (file: File) => {
    uploadRecipeImage(file);
  };

  const handleUrlSubmit = (url: string) => {
    submitRecipeUrl(url);
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

  const renderFormattedResponse = (response: string) => {
    if (!response) return null;
    
    const sections = [];
    let currentSection = { heading: '', content: [] };
    
    response.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.endsWith(':') && !trimmedLine.includes('\u2022') && !trimmedLine.includes('-')) {
        if (currentSection.content.length > 0 || currentSection.heading) {
          sections.push({...currentSection});
        }
        currentSection = { 
          heading: trimmedLine, 
          content: []
        };
      } else if (trimmedLine) {
        currentSection.content.push(trimmedLine);
      }
    });
    
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
                ) : null;
              }
              
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
            {chatHistory.map((chat, index) => (
              <div key={chat.id} className="space-y-4">
                <div className="flex justify-end mb-4">
                  <div className="max-w-[85%] bg-[#9b87f5] text-white px-4 py-2 rounded-[20px] rounded-tr-[5px]">
                    <p>{chat.user_message}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="max-w-[85%] space-y-3">
                    <div className="bg-white px-4 py-2 rounded-[20px] rounded-tl-[5px] shadow-sm">
                      <div className="prose prose-sm max-w-none text-[#221F26]">
                        {renderFormattedResponse(chat.ai_response)}
                      </div>
                    </div>

                    {chat.changes_suggested?.scientific_principles && chat.changes_suggested.scientific_principles.length > 0 && (
                      <div className="bg-white/80 px-4 py-3 rounded-[20px] shadow-sm">
                        <h4 className="font-medium mb-2 flex items-center gap-1 text-[#221F26]">
                          <Beaker className="h-4 w-4" />
                          Scientific Principles:
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {chat.changes_suggested.scientific_principles.map((principle, i) => (
                            <li key={i} className="text-sm">{principle}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {chat.changes_suggested?.equipmentNeeded && chat.changes_suggested.equipmentNeeded.length > 0 && (
                      <div className="bg-white/80 px-4 py-3 rounded-[20px] shadow-sm">
                        <h4 className="font-medium mb-2 flex items-center gap-1 text-[#221F26]">
                          <ChefHat className="h-4 w-4" />
                          Equipment Needed:
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {chat.changes_suggested.equipmentNeeded.map((equipment, i) => (
                            <li key={i} className="text-sm">{equipment}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {chat.changes_suggested?.nutrition && Object.keys(chat.changes_suggested.nutrition).length > 0 && (
                      <div className="bg-white/80 px-4 py-3 rounded-[20px] shadow-sm">
                        <h4 className="font-medium mb-2 text-[#221F26]">Nutritional Impact:</h4>
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

                    {chat.changes_suggested?.health_insights && chat.changes_suggested.health_insights.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {chat.changes_suggested.health_insights.map((insight, i) => (
                          <Badge key={i} variant="secondary" className="bg-white/80">{insight}</Badge>
                        ))}
                      </div>
                    )}

                    {chat.follow_up_questions && chat.follow_up_questions.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {chat.follow_up_questions.map((question, qIndex) => (
                            <Button
                              key={qIndex}
                              variant="outline"
                              size="sm"
                              onClick={() => setMessage(question)}
                              className="bg-white/80 hover:bg-white"
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {chat.changes_suggested && !chat.applied && (
                      <div>
                        <Button
                          onClick={() => applyChanges.mutate(chat)}
                          disabled={isApplying}
                          className="gap-2 bg-[#9b87f5] hover:bg-[#8b77e5]"
                        >
                          {isApplying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Apply Scientific Improvements
                        </Button>
                      </div>
                    )}

                    {chat.applied && (
                      <p className="text-sm text-green-500 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Improvements applied
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <RecipeChatInput
            message={message}
            setMessage={setMessage}
            onSubmit={sendMessage}
            isSending={isSending}
            onUpload={handleUpload}
            onUrlSubmit={handleUrlSubmit}
          />
        </div>
      </CardContent>
    </Card>
  );
}

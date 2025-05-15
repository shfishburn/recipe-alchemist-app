
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ChatMessage as ChatMessageComp } from './ChatMessage';
import { ApplyChangesSection } from './response/ApplyChangesSection';
import { SourceSection } from './response/SourceSection';
import type { ChatMessage } from '@/types/chat';
import type { Recipe } from '@/types/recipe';

interface ChatResponseProps {
  chatMessage: ChatMessage;
  onApplyChanges: (recipe: Recipe, chatMessage: ChatMessage) => Promise<boolean>;
  isApplying: boolean;
}

export const ChatResponse: React.FC<ChatResponseProps> = ({
  chatMessage,
  onApplyChanges,
  isApplying
}) => {
  const [parsedResponse, setParsedResponse] = useState<string>('');
  const [isResponseParsed, setIsResponseParsed] = useState(false);
  const [isApplied, setIsApplied] = useState(chatMessage.applied || false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  // Parse the AI response as Markdown
  useEffect(() => {
    // Extract text response from the AI response - could be in various formats
    const textResponse = chatMessage.ai_response;
    
    if (textResponse) {
      setParsedResponse(textResponse);
      setIsResponseParsed(true);
    } else {
      setParsedResponse('No response available');
      setIsResponseParsed(true);
    }
  }, [chatMessage]);

  // Handle apply changes
  const handleApplyChanges = async () => {
    // We need a valid recipe to apply changes
    if (!recipe) {
      console.error("Cannot apply changes: Recipe not loaded");
      return false;
    }
    
    try {
      const success = await onApplyChanges(recipe, chatMessage);
      
      if (success) {
        setIsApplied(true);
      }
      
      return success;
    } catch (error) {
      console.error("Error applying changes:", error);
      return false;
    }
  };

  // Loading state
  if (!isResponseParsed) {
    return (
      <Card className="p-4 flex items-center justify-center w-full">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm">Loading response...</span>
      </Card>
    );
  }

  return (
    <div>
      {/* AI response */}
      <ChatMessageComp message={parsedResponse} isUser={false} />
      
      {/* Source info (for image/URL imports) */}
      <SourceSection chatMessage={chatMessage} />
      
      {/* "Apply changes" section if needed */}
      {chatMessage.changes_suggested && Object.keys(chatMessage.changes_suggested).length > 0 && (
        <ApplyChangesSection 
          changes={chatMessage.changes_suggested}
          onApplyChanges={handleApplyChanges}
          isApplying={isApplying}
          applied={isApplied}
        />
      )}
    </div>
  );
};

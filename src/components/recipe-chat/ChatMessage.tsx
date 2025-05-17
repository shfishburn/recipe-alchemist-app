
import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/components/markdown/Markdown';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import type { ChatMessage, ChatHistoryItem } from '@/types/chat';
import type { Recipe } from '@/types/recipe';

interface ChatMessageProps {
  message: ChatHistoryItem;
  isUser: boolean;
  recipe: Recipe;
  onApplyChanges?: (message: ChatMessage) => void;
  onRetry?: (text: string, id: string) => void;
  isApplying?: boolean;
}

export function ChatMessage({
  message,
  isUser,
  recipe,
  onApplyChanges,
  onRetry,
  isApplying = false,
}: ChatMessageProps) {
  // Check if the message contains a complete recipe update
  const hasCompleteRecipe = 'recipe' in message && !!message.recipe;
  
  // Check if the message contains partial changes
  const hasPartialChanges = 'changes_suggested' in message && !!message.changes_suggested;
  
  // Determine if any changes are suggested
  const hasChanges = hasCompleteRecipe || hasPartialChanges;
  
  // Determine if changes can be applied (is a ChatMessage, has changes, and not applied yet)
  const canApplyChanges = 
    'ai_response' in message && 
    hasChanges && 
    !message.applied && 
    typeof onApplyChanges === 'function';
    
  // Check if message is pending
  const isPending = 'pending' in message && message.pending;
  
  // Check if message has an error
  const hasError = message.meta?.error;
  
  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex flex-col max-w-[80%] md:max-w-[70%] lg:max-w-[65%] rounded-lg p-3 mb-2',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        )}
      >
        {/* User message */}
        {isUser && (
          <div className="text-sm md:text-base whitespace-pre-wrap break-words">
            {message.user_message}
          </div>
        )}
        
        {/* AI Response */}
        {!isUser && !isPending && 'ai_response' in message && (
          <div className="text-sm md:text-base prose dark:prose-invert max-w-none">
            <Markdown>{message.ai_response}</Markdown>
            
            {/* Display action buttons for messages with changes */}
            {canApplyChanges && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                  onClick={() => onApplyChanges(message as ChatMessage)} 
                  disabled={isApplying}
                  size="sm"
                  variant="secondary"
                >
                  {isApplying && <Spinner className="mr-2 h-4 w-4" />}
                  Apply Changes
                </Button>
              </div>
            )}
            
            {/* Show applied badge for applied changes */}
            {message.applied && (
              <div className="mt-2">
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Applied
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Loading state */}
        {!isUser && isPending && (
          <div className="flex items-center space-x-2">
            <Spinner className="h-4 w-4" />
            <span className="text-sm">Processing...</span>
          </div>
        )}
        
        {/* Error state */}
        {!isUser && hasError && (
          <Card className="mt-2 p-3 bg-destructive bg-opacity-10 border-destructive">
            <p className="text-sm text-destructive mb-2">
              {message.meta?.error_details || 'Failed to process request'}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRetry?.(message.user_message, message.id)}
            >
              Retry
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

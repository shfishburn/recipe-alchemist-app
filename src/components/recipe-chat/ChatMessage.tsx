
import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Markdown } from '@/components/markdown/Markdown';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bug, Copy } from 'lucide-react';
import type { ChatMessage as ChatMessageType, OptimisticMessage } from '@/types/chat';
import type { Recipe } from '@/types/recipe';

type AnyMessageType = ChatMessageType | OptimisticMessage;

interface ChatMessageProps {
  message: AnyMessageType;
  isUser: boolean;
  recipe: Recipe;
  onApplyChanges?: (message: ChatMessageType) => Promise<boolean>;
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
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isApplyingLocal, setIsApplyingLocal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
  const hasError = message.meta?.error || errorMessage;

  // Handle applying changes
  const handleApplyChanges = async () => {
    if (!onApplyChanges || !('id' in message)) return;

    try {
      setErrorMessage(null);
      setIsApplyingLocal(true);
      
      // Create an extended message with recipe_id guaranteed to be present
      // This is critical - we use recipe from props if message.recipe_id is missing
      const extendedMessage: ChatMessageType = {
        ...(message as ChatMessageType),
        recipe_id: message.recipe_id || recipe?.id
      };
      
      console.log("Applying changes for message:", { 
        id: extendedMessage.id,
        recipe_id: extendedMessage.recipe_id,
        hasChangesSuggested: hasChanges,
        timestamp: new Date().toISOString()
      });
      
      await onApplyChanges(extendedMessage);
    } catch (error) {
      console.error("Error applying changes:", {
        id: message.id,
        error,
        timestamp: new Date().toISOString()
      });
      
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsApplyingLocal(false);
    }
  };

  // Handle copying debug info to clipboard
  const handleCopyDebug = () => {
    if (!('ai_response' in message)) return;
    
    const debugContent = JSON.stringify({
      messageId: message.id,
      recipe_id: message.recipe_id || recipe?.id,
      userMessage: message.user_message,
      aiResponse: message.ai_response,
      recipe: message.recipe || null,
      changesSuggested: message.changes_suggested || null,
      applied: message.applied || false
    }, null, 2);
    
    navigator.clipboard.writeText(debugContent);
    console.log("Content copied to clipboard");
  };
  
  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex flex-col max-w-[80%] md:max-w-[70%] lg:max-w-[65%] rounded-lg p-3 mb-2 relative',
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
            
            {/* Debug button for AI messages */}
            {!isUser && 'ai_response' in message && (
              <div className="absolute top-2 right-2">
                <Dialog open={isDebugOpen} onOpenChange={setIsDebugOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      title="Debug message"
                      onClick={() => {
                        console.log("Opening debug panel for message:", message.id);
                        console.log("Viewing debug info for message:", {
                          messageId: message.id,
                          recipe_id: message.recipe_id || recipe?.id,
                          responseSummary: message.ai_response?.substring(0, 100) + "...",
                          hasChanges: hasChanges
                        });
                      }}
                    >
                      <Bug className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>Debug Info</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1" 
                          onClick={handleCopyDebug}
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </Button>
                      </DialogTitle>
                      <DialogDescription>
                        Additional debugging information about this message
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      <div className="space-y-4 p-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Recipe ID:</h4>
                          <pre className="text-xs bg-muted p-2 rounded overflow-auto break-words whitespace-pre-wrap">{message.recipe_id || recipe?.id || 'undefined'}</pre>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">User Message:</h4>
                          <pre className="text-xs bg-muted p-2 rounded overflow-auto break-words whitespace-pre-wrap">{message.user_message}</pre>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">AI Response:</h4>
                          <pre className="text-xs bg-muted p-2 rounded overflow-auto break-words whitespace-pre-wrap">{message.ai_response}</pre>
                        </div>
                        {hasCompleteRecipe && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Recipe Changes:</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-[300px]">{JSON.stringify(message.recipe, null, 2)}</pre>
                          </div>
                        )}
                        {hasPartialChanges && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Suggested Changes:</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-[300px]">{JSON.stringify(message.changes_suggested, null, 2)}</pre>
                          </div>
                        )}
                        {message.meta && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Metadata:</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(message.meta, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            
            {/* Display any error message */}
            {hasError && (
              <Card className="mt-2 p-3 bg-red-50 border-red-200 text-red-700">
                <p className="text-xs font-medium">Error: {typeof hasError === 'string' ? hasError : message.meta?.error_details || 'Failed to apply changes'}</p>
              </Card>
            )}
            
            {/* Display action buttons for messages with changes */}
            {canApplyChanges && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                  onClick={handleApplyChanges} 
                  disabled={isApplying || isApplyingLocal}
                  size="sm"
                  variant="secondary"
                >
                  {(isApplying || isApplyingLocal) && <Spinner className="mr-2 h-4 w-4" />}
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
        {!isUser && message.meta?.error && (
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

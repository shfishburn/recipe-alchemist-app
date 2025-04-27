
import React from 'react';
import { Message } from "@chatscope/chat-ui-kit-react";
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatResponseProps {
  response: string;
  changesSuggested: any | null;
  followUpQuestions: string[];
  setMessage: (message: string) => void;
  onApplyChanges: () => void;
  isApplying: boolean;
  applied: boolean;
}

export function ChatResponse({ 
  response, 
  changesSuggested, 
  followUpQuestions, 
  setMessage, 
  onApplyChanges,
  isApplying,
  applied
}: ChatResponseProps) {
  const handleFollowUpClick = (question: string) => {
    if (!isApplying) {
      setMessage(question);
    }
  };

  return (
    <div className="animate-fade-in">
      <Message
        model={{
          message: response || "No response available",
          direction: "incoming",
          position: "single"
        }}
        className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
      >
        {changesSuggested && (
          <Message.CustomContent>
            <Button
              onClick={onApplyChanges}
              disabled={isApplying || applied}
              className={cn(
                "mt-4 transition-colors duration-200",
                applied 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-blue-500 hover:bg-blue-600"
              )}
              size="sm"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : applied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Applied
                </>
              ) : (
                'Apply Changes'
              )}
            </Button>
          </Message.CustomContent>
        )}
      </Message>

      {followUpQuestions.length > 0 && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Follow-up Questions
          </div>
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleFollowUpClick(question)}
                disabled={isApplying}
                className={cn(
                  "px-4 py-2 text-sm rounded-full transition-colors duration-200",
                  "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
                  "text-gray-700 dark:text-gray-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


import React from 'react';
import { Message, Button as ChatButton } from "@chatscope/chat-ui-kit-react";
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';

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
  // Try to parse the response if it's a JSON string
  let displayText = response;
  try {
    const parsedResponse = JSON.parse(response);
    if (parsedResponse && typeof parsedResponse.textResponse === 'string') {
      displayText = parsedResponse.textResponse;
    }
  } catch (e) {
    // If parsing fails, just use the response as is
  }

  const handleFollowUpClick = (question: string) => {
    setMessage(question);
  };

  return (
    <div>
      <Message
        model={{
          message: displayText,
          direction: "incoming",
          position: "single"
        }}
        className="mb-4"
      >
        {changesSuggested && (
          <Message.CustomContent>
            <Button
              onClick={onApplyChanges}
              disabled={isApplying || applied}
              className={`${applied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white mt-4`}
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

      {followUpQuestions && followUpQuestions.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Follow-up Questions</div>
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.map((question, index) => (
              <ChatButton
                key={index}
                onClick={() => handleFollowUpClick(question)}
                style={{ fontSize: '0.875rem' }}
              >
                {question}
              </ChatButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

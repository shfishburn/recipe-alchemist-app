
import React from 'react';
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
  let displayText = response;
  
  // Try to parse JSON response if applicable
  if (response) {
    try {
      const responseObj = JSON.parse(response);
      if (responseObj && typeof responseObj.textResponse === 'string') {
        displayText = responseObj.textResponse;
      }
    } catch (e) {
      // If parsing fails, use the response as is
      console.log("Using raw response - not JSON format");
    }
  }

  const handleFollowUpClick = (question: string) => {
    setMessage(question);
  };

  // Split text into paragraphs and filter out empty lines
  const paragraphs = displayText.split('\n').filter(Boolean);

  return (
    <div className="flex-1">
      <div className="flex flex-col space-y-4">
        <div className="bg-white rounded-[20px] rounded-tl-[5px] p-4 shadow-sm">
          <div className="prose prose-sm max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>

          {changesSuggested && (
            <div className="mt-4">
              <Button
                onClick={onApplyChanges}
                disabled={isApplying || applied}
                className={`${applied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
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
            </div>
          )}

          {followUpQuestions && followUpQuestions.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Follow-up Questions</h4>
              <div className="flex flex-wrap gap-2">
                {followUpQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-left"
                    onClick={() => handleFollowUpClick(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

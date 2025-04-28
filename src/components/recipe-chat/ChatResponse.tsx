
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const [applyError, setApplyError] = useState<string | null>(null);
  
  const displayText = React.useMemo(() => {
    if (!response) return '';
    
    try {
      // Enhanced JSON parsing with better text extraction
      let text = '';
      
      try {
        const parsedResponse = JSON.parse(response);
        // Extract the text content from the parsed JSON
        text = parsedResponse.textResponse || parsedResponse.response || '';
      } catch (e) {
        // If it's not valid JSON, use the raw response as text
        text = response;
      }
      
      // If we still don't have text, use the raw response
      if (!text && typeof response === 'string') {
        text = response;
      }
      
      // Clean up the response by removing any remaining JSON syntax markers
      text = text
        .replace(/^\s*{/g, '')
        .replace(/}\s*$/g, '')
        .replace(/"textResponse":/g, '')
        .replace(/"response":/g, '')
        .replace(/^["']|["']$/g, '')
        .trim();

      // Enhanced ingredient highlighting
      if (changesSuggested?.ingredients?.items && Array.isArray(changesSuggested.ingredients.items)) {
        // Create a map of normalized ingredient names to their display text
        changesSuggested.ingredients.items.forEach((ingredient: any) => {
          if (ingredient && typeof ingredient.item === 'string') {
            // Make sure ingredient mention in text is highlighted
            const regex = new RegExp(`${ingredient.item}`, 'gi');
            text = text.replace(regex, `**${ingredient.item}**`);
            
            // Also highlight quantity mentions
            if (ingredient.qty && ingredient.unit) {
              const qtyRegex = new RegExp(`${ingredient.qty} ${ingredient.unit}\\s+(?!\\*\\*)`, 'gi');
              text = text.replace(qtyRegex, `**${ingredient.qty} ${ingredient.unit}** `);
            }
          }
        });
      }

      // Format instructions with better context
      if (changesSuggested?.instructions && Array.isArray(changesSuggested.instructions)) {
        changesSuggested.instructions.forEach((instruction: string | { action: string }) => {
          const instructionText = typeof instruction === 'string' ? instruction : instruction.action;
          if (instructionText && !instructionText.includes('**')) {
            const regex = new RegExp(
              instructionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'g'
            );
            text = text.replace(regex, `**${instructionText}**`);
          }
        });
      }

      return text;
    } catch (e) {
      console.error("Error formatting response:", e);
      return response || 'Error formatting response';
    }
  }, [response, changesSuggested]);

  const showWarning = React.useMemo(() => {
    if (!changesSuggested?.ingredients?.items) return false;
    
    // Check for any ingredients with warning notes
    return changesSuggested.ingredients.items.some((item: any) => 
      item.notes?.toLowerCase().includes('warning')
    );
  }, [changesSuggested]);

  const handleFollowUpClick = (question: string) => {
    setMessage(question);
  };

  const handleApplyChanges = () => {
    setApplyError(null); // Reset any previous errors
    
    try {
      // Enhanced validation before applying changes
      if (!changesSuggested) {
        setApplyError("No changes to apply. The AI didn't suggest any modifications.");
        return;
      }
      
      // Check for actual substantive changes
      const hasTitle = !!changesSuggested.title;
      const hasInstructions = Array.isArray(changesSuggested.instructions) && changesSuggested.instructions.length > 0;
      const hasIngredients = changesSuggested.ingredients?.mode !== 'none' && 
                             Array.isArray(changesSuggested.ingredients?.items) && 
                             changesSuggested.ingredients?.items.length > 0;
      
      if (!hasTitle && !hasInstructions && !hasIngredients) {
        setApplyError("No substantive changes to apply. The AI didn't suggest any specific modifications.");
        return;
      }
      
      // If we get here, there are valid changes to apply
      onApplyChanges();
    } catch (error) {
      console.error("Error preparing to apply changes:", error);
      setApplyError(error instanceof Error ? error.message : "Failed to apply changes. Please try again.");
    }
  };

  const renderFormattedText = (text: string) => {
    // Improved text formatting with better handling of bold sections
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-blue-600">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex-1">
      <div className="flex flex-col space-y-4">
        <div className="bg-white rounded-[20px] rounded-tl-[5px] p-4 shadow-sm">
          {showWarning && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Some suggested changes may need review. Please check the ingredient quantities carefully.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="prose prose-sm max-w-none">
            {displayText.split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={index} className="mb-2">{renderFormattedText(paragraph)}</p>
            ))}
          </div>

          {changesSuggested && (
            <div className="mt-4">
              {applyError && (
                <Alert variant="destructive" className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{applyError}</AlertDescription>
                </Alert>
              )}
              
              <Button
                onClick={handleApplyChanges}
                disabled={isApplying || applied}
                className={`${
                  applied ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
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

          {followUpQuestions?.length > 0 && (
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


import React from 'react';
import { WarningAlert } from './response/WarningAlert';
import { FormattedText } from './response/FormattedText';
import { ApplyChangesSection } from './response/ApplyChangesSection';
import { FollowUpQuestions } from './response/FollowUpQuestions';
import { useResponseFormatter } from './response/ResponseFormatter';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ChangesResponse } from '@/types/chat';

interface ChatResponseProps {
  response: string;
  changesSuggested: ChangesResponse | null;
  followUpQuestions: string[];
  setMessage: (message: string) => void;
  onApplyChanges: () => void;
  isApplying: boolean;
  applied: boolean;
  isMobile?: boolean;
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
  const { displayText, showWarning, changesPreview } = useResponseFormatter({ response, changesSuggested });
  const isMobile = useIsMobile();
  
  const handleFollowUpClick = (question: string) => {
    setMessage(question);
  };

  const textSize = isMobile ? "text-xs sm:text-sm" : "text-sm";
  const bubblePadding = isMobile ? "p-2 sm:p-4" : "p-4";
  
  // Helper to determine if text contains scientific content
  const containsScientificContent = (text: string): boolean => {
    const scientificTerms = [
      'maillard', 'reaction', 'chemistry', 'temperature', 'techniques',
      'protein', 'structure', 'starch', 'gelatinization', 'degree',
      'celsius', 'fahrenheit', 'hydration', 'fat', 'emulsion', 'science'
    ];
    
    const lowerText = text.toLowerCase();
    return scientificTerms.some(term => lowerText.includes(term));
  };
  
  // Apply special styling for scientific content
  const isScientific = containsScientificContent(displayText);

  // Split text into paragraphs for proper formatting
  const paragraphs = displayText.split('\n').filter(Boolean);

  return (
    <div className="flex-1 max-w-[calc(100%-32px)]">
      <div className="flex flex-col space-y-2 sm:space-y-4">
        <div className={`bg-white ${isScientific ? 'bg-gradient-to-br from-white to-blue-50/30' : ''} 
                         rounded-[20px] rounded-tl-[5px] ${bubblePadding} shadow-sm border 
                         ${isScientific ? 'border-blue-100' : 'border-slate-100'}`}>
          {/* Warning alert for ingredient issues */}
          <WarningAlert showWarning={showWarning} isMobile={isMobile} />
          
          {/* Main response text content */}
          <div className={`prose prose-sm max-w-none ${textSize} text-slate-800`}>
            {paragraphs.map((paragraph, index) => (
              <FormattedText key={index} text={paragraph} className={index > 0 ? "mt-2" : ""} />
            ))}
          </div>
          
          {/* Apply changes section with summary and confirmation */}
          <ApplyChangesSection 
            changesSuggested={changesSuggested}
            onApplyChanges={onApplyChanges}
            isApplying={isApplying}
            applied={applied}
            isMobile={isMobile}
          />

          {/* Follow-up questions section */}
          <FollowUpQuestions
            questions={followUpQuestions}
            onQuestionClick={handleFollowUpClick}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}

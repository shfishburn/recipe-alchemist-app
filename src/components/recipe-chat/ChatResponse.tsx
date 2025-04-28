
import React from 'react';
import { WarningAlert } from './response/WarningAlert';
import { FormattedText } from './response/FormattedText';
import { ApplyChangesSection } from './response/ApplyChangesSection';
import { FollowUpQuestions } from './response/FollowUpQuestions';
import { useResponseFormatter } from './response/ResponseFormatter';

interface ChatResponseProps {
  response: string;
  changesSuggested: any | null;
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
  applied,
  isMobile = false
}: ChatResponseProps) {
  const { displayText, showWarning } = useResponseFormatter({ response, changesSuggested });
  
  const handleFollowUpClick = (question: string) => {
    setMessage(question);
  };

  const textSize = isMobile ? "text-xs sm:text-sm" : "text-sm";
  const bubblePadding = isMobile ? "p-2 sm:p-4" : "p-4";

  return (
    <div className="flex-1 max-w-[calc(100%-32px)]">
      <div className="flex flex-col space-y-2 sm:space-y-4">
        <div className={`bg-white rounded-[20px] rounded-tl-[5px] ${bubblePadding} shadow-sm border border-slate-100`}>
          {/* Warning alert for ingredient issues */}
          <WarningAlert showWarning={showWarning} isMobile={isMobile} />
          
          {/* Main response text content */}
          <div className={`prose prose-sm max-w-none ${textSize} text-slate-800`}>
            {displayText.split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={index} className="mb-1 sm:mb-2">
                <FormattedText text={paragraph} />
              </p>
            ))}
          </div>

          {/* Apply changes section */}
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

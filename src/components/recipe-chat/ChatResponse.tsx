
import React, { useEffect } from 'react';
import { WarningAlert } from './response/WarningAlert';
import { FormattedText } from './response/FormattedText';
import { ApplyChangesSection } from './response/ApplyChangesSection';
import { FollowUpQuestions } from './response/FollowUpQuestions';
import { useResponseFormatter } from './response/hooks/useResponseFormatter';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DebugPanel } from './response/DebugPanel';
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
  messageId?: string;
}

export function ChatResponse({ 
  response, 
  changesSuggested, 
  followUpQuestions, 
  setMessage, 
  onApplyChanges,
  isApplying,
  applied,
  messageId
}: ChatResponseProps) {
  const { displayText, showWarning, changesPreview, isMethodology } = useResponseFormatter({ 
    response, 
    changesSuggested 
  });
  
  const isMobile = useIsMobile();
  
  // Log AI response for enhanced debugging with more detailed information
  useEffect(() => {
    console.log("[ChatResponse] Rendering response:", {
      messageId,
      timestamp: new Date().toISOString(),
      responseLength: response.length,
      displayTextLength: displayText.length,
      isMethodology,
      hasChangesSuggested: !!changesSuggested,
      changesPreview: changesSuggested ? Object.keys(changesSuggested).length : 0,
      followUpQuestions: followUpQuestions.length,
      isApplying,
      applied,
      showWarning,
      isMobile,
    });

    // Log response parsing info
    console.debug("[ChatResponse] Response analysis:", {
      messageId,
      parsingComplete: true,
      displayTextPreview: displayText.substring(0, 100) + (displayText.length > 100 ? '...' : ''),
      contentType: isMethodology ? 'methodology' : 'standard',
      warningTriggered: showWarning,
    });
    
    return () => {
      console.log("[ChatResponse] Unmounting response component:", {
        messageId,
        timestamp: new Date().toISOString()
      });
    };
  }, [
    response, 
    changesSuggested, 
    messageId, 
    displayText, 
    isMethodology, 
    followUpQuestions,
    isMobile,
    showWarning,
    isApplying,
    applied
  ]);
  
  const handleFollowUpClick = (question: string) => {
    console.log("[ChatResponse] Follow-up question clicked:", {
      messageId,
      question,
      timestamp: new Date().toISOString()
    });
    setMessage(question);
  };

  const textSize = isMobile ? "text-xs sm:text-sm" : "text-sm";
  const bubblePadding = isMobile ? "p-2 sm:p-4" : "p-4";
  
  // Helper to determine if text contains scientific content
  const isScientific = displayText.toLowerCase().includes('protein') || 
                       displayText.toLowerCase().includes('temperature') ||
                       displayText.toLowerCase().includes('reaction');

  return (
    <div className="flex-1 max-w-[calc(100%-32px)]">
      <div className="flex flex-col space-y-2 sm:space-y-4">
        <div className={`bg-white ${isScientific ? 'bg-gradient-to-br from-white to-blue-50/30' : ''} 
                         rounded-[20px] rounded-tl-[5px] ${bubblePadding} shadow-sm border 
                         ${isScientific ? 'border-blue-100' : 'border-slate-100'}`}>
          {/* Debug panel icon with better positioning for mobile */}
          <div className="flex justify-end mb-1">
            <DebugPanel 
              response={response}
              changesSuggested={changesSuggested}
              messageId={messageId}
            />
          </div>
          
          {/* Warning alert for ingredient issues */}
          <WarningAlert showWarning={showWarning} isMobile={isMobile} />
          
          {/* Main response text content with enhanced scroll behavior */}
          <ScrollArea className="max-h-[300px] overflow-auto">
            <div className={`prose prose-sm max-w-none ${textSize} text-slate-800 break-words`}>
              <FormattedText 
                text={displayText} 
                preserveWhitespace={isMethodology}
              />
            </div>
          </ScrollArea>
          
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

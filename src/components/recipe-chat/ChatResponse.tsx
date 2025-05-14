
import React, { useState } from 'react';
import { AppAvatar } from '@/components/ui/app-avatar';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import type { ChangesResponse } from '@/types/chat';
import { ApplyChangesSection } from './response/ApplyChangesSection';
import { FollowUpQuestions } from './response/FollowUpQuestions';
import { Button } from '@/components/ui/button';

interface ChatResponseProps {
  response: string;
  changesSuggested: ChangesResponse | null;
  followUpQuestions?: string[];
  setMessage: (message: string) => void;
  onApplyChanges: () => void;
  isApplying: boolean;
  applied: boolean;
  recipeId?: string;  // Add recipeId prop
}

export function ChatResponse({
  response,
  changesSuggested,
  followUpQuestions = [],
  setMessage,
  onApplyChanges,
  isApplying,
  applied,
  recipeId  // Include the recipeId
}: ChatResponseProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChanges = !!changesSuggested;
  
  // Determine if response is long and should be truncated
  const isLongResponse = response.length > 500;
  const displayResponse = isLongResponse && !expanded 
    ? response.substring(0, 500) + '...' 
    : response;
    
  const toggleExpand = () => setExpanded(prev => !prev);
  
  return (
    <div className="flex items-start space-x-2 sm:space-x-4">
      <div className="mt-1">
        <AppAvatar size="sm" role="ai" />
      </div>
      
      <div className="flex-1 bg-primary-foreground/50 rounded-lg p-3 sm:p-4 shadow-sm border border-muted">
        <div className="prose prose-sm sm:prose-base max-w-none prose-p:mb-2 prose-p:mt-0 prose-headings:mb-2 prose-headings:mt-2">
          <ReactMarkdown className={cn(
            "text-sm sm:text-base leading-normal",
            isLongResponse && !expanded ? "line-clamp-10" : ""
          )}>
            {displayResponse}
          </ReactMarkdown>
          
          {isLongResponse && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={toggleExpand} 
              className="p-0 h-auto text-xs sm:text-sm text-muted-foreground"
            >
              {expanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>
        
        {/* Apply Changes Section - now with recipeId */}
        {hasChanges && (
          <ApplyChangesSection
            changesSuggested={changesSuggested}
            onApplyChanges={onApplyChanges}
            isApplying={isApplying}
            applied={applied}
            recipeId={recipeId}  // Pass the recipeId
          />
        )}
        
        {/* Follow-up Questions Section */}
        {followUpQuestions && followUpQuestions.length > 0 && (
          <FollowUpQuestions
            questions={followUpQuestions}
            onQuestionClick={setMessage}
          />
        )}
      </div>
    </div>
  );
}

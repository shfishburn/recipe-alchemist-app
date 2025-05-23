
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FollowUpQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isMobile?: boolean;
}

export function FollowUpQuestions({ questions, onQuestionClick, isMobile = false }: FollowUpQuestionsProps) {
  if (!questions?.length) return null;
  
  return (
    <div className="mt-3 sm:mt-6">
      <h4 className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2.5 text-slate-700">Follow-up Questions</h4>
      <ScrollArea className="max-h-[120px] pr-2">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {questions.map((question, index) => (
            <button
              key={index}
              className="text-xs sm:text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-left text-slate-800 border border-gray-200 transition-colors max-w-full touch-target"
              onClick={() => onQuestionClick(question)}
            >
              <span className="truncate block">{question}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

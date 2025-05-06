
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface FollowUpQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isMobile?: boolean;
}

export function FollowUpQuestions({ questions = [], onQuestionClick, isMobile = false }: FollowUpQuestionsProps) {
  if (!questions.length) return null;
  
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center mb-2">
        <HelpCircle className="h-4 w-4 text-slate-500 mr-2" />
        <p className="text-xs font-medium text-slate-600">Suggested questions</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {questions.map((question, idx) => (
          <Button
            key={idx}
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="bg-blue-50/50 border-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-full py-1 h-auto text-xs"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}

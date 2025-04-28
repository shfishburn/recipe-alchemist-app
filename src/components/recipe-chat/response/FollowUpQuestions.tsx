
import React from 'react';

interface FollowUpQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isMobile?: boolean;
}

export function FollowUpQuestions({ questions, onQuestionClick, isMobile = false }: FollowUpQuestionsProps) {
  if (!questions?.length) return null;
  
  return (
    <div className="mt-3 sm:mt-6">
      <h4 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-slate-700">Follow-up Questions</h4>
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            className="text-xs sm:text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-left text-slate-800 border border-gray-200 transition-colors"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

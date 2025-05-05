
import React from 'react';
import { formatReactionName } from '@/hooks/use-recipe-science';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface StepReactionItemProps {
  reaction: StepReaction;
  index: number;
}

export function StepReactionItem({ reaction, index }: StepReactionItemProps) {
  if (!reaction.step_text) return null;

  // Get reaction details
  const reactionDetails = Array.isArray(reaction.reaction_details) && reaction.reaction_details.length > 0 
    ? reaction.reaction_details[0] 
    : '';
    
  return (
    <div key={`reaction-${index}`} className="p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-1">
          <p className="font-semibold text-slate-800">Step {index + 1}: {reaction.step_text}</p>
          {reactionDetails && (
            <p className="text-sm text-slate-600 mt-2">{reactionDetails}</p>
          )}
        </div>
      </div>
      {reaction.reactions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200">
          {reaction.reactions.map((type, i) => (
            <span 
              key={`${index}-${i}`} 
              className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              {formatReactionName(type)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

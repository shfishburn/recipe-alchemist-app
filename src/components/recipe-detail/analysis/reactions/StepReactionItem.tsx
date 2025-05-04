
import React from 'react';
import { ReactionTagsList } from './ReactionTagsList';
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
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-1">
          <p className="font-semibold text-slate-800">Step {index + 1}: {reaction.step_text}</p>
          {reactionDetails && (
            <p className="text-sm text-slate-600 mt-2">{reactionDetails}</p>
          )}
        </div>
      </div>
      
      <ReactionTagsList 
        reactions={reaction.reactions} 
        stepIndex={index}
      />
    </div>
  );
}

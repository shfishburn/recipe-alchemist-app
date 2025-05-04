
import React from 'react';
import { Beaker } from "lucide-react";
import { StepReactionItem } from './StepReactionItem';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface ReactionsListProps {
  stepReactions: StepReaction[];
}

export function ReactionsList({ stepReactions }: ReactionsListProps) {
  if (!stepReactions || stepReactions.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
        <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
        Step-by-Step Reaction Analysis
      </h3>
      <div className="space-y-4">
        {stepReactions.map((reaction, index) => (
          <StepReactionItem 
            key={`reaction-${index}`}
            reaction={reaction}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

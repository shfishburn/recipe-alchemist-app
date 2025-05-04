
import React from 'react';
import { ReactionTag } from './ReactionTag';

interface ReactionTagsListProps {
  reactions: string[];
  stepIndex: number;
}

export function ReactionTagsList({ reactions, stepIndex }: ReactionTagsListProps) {
  if (!reactions || reactions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-blue-200">
      {reactions.map((type, i) => (
        <ReactionTag 
          key={`${stepIndex}-${i}`} 
          reaction={type}
        />
      ))}
    </div>
  );
}

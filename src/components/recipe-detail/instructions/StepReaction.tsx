
import React from 'react';
import { Atom } from 'lucide-react';

interface StepReactionProps {
  reactions: string[];
  expanded?: boolean;
}

// Format reaction names for better display
const formatReactionName = (reaction: string): string => {
  return reaction
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function StepReaction({ reactions, expanded = false }: StepReactionProps) {
  if (!reactions || reactions.length === 0) return null;
  
  if (expanded) {
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {reactions.map((type, i) => (
          <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
            {formatReactionName(type)}
          </span>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {reactions.slice(0, 2).map((type, i) => (
        <span 
          key={i} 
          className="inline-flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
        >
          <Atom className="h-3 w-3 mr-1" />
          {formatReactionName(type)}
        </span>
      ))}
      {reactions.length > 2 && (
        <span className="text-xs text-blue-600">
          +{reactions.length - 2} more
        </span>
      )}
    </div>
  );
}

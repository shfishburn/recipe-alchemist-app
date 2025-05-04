
import React from 'react';
import { formatReactionName } from '@/hooks/use-recipe-science';

interface ReactionTagProps {
  reaction: string;
}

export function ReactionTag({ reaction }: ReactionTagProps) {
  // Apply consistent color scheme based on reaction type
  const getTagColors = (reactionType: string): string => {
    switch (reactionType.toLowerCase()) {
      case 'maillard':
      case 'caramelization':
        return 'bg-amber-100 text-amber-800';
      case 'gelatinization':
      case 'denaturation':
        return 'bg-blue-100 text-blue-800';
      case 'fermentation':
        return 'bg-purple-100 text-purple-800';
      case 'emulsification':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const colorClasses = getTagColors(reaction);
  
  return (
    <span className={`text-xs px-2.5 py-1 ${colorClasses} rounded-full`}>
      {formatReactionName(reaction)}
    </span>
  );
}

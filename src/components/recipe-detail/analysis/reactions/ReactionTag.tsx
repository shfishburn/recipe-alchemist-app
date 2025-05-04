
import React from 'react';
import { formatReactionName } from '@/hooks/use-recipe-science';

interface ReactionTagProps {
  reaction: string;
}

export function ReactionTag({ reaction }: ReactionTagProps) {
  return (
    <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
      {formatReactionName(reaction)}
    </span>
  );
}

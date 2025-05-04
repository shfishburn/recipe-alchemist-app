
import React from 'react';
import { Atom } from 'lucide-react';
import { StepReaction } from './StepReaction';

interface ScienceNoteProps {
  reactionDetails: string[];
  reactions: string[];
}

export function ScienceNote({ reactionDetails, reactions }: ScienceNoteProps) {
  return (
    <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md">
      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
        <Atom className="h-4 w-4 mr-1" />
        <span>Science Notes</span>
      </h4>
      <div className="text-sm text-blue-700 space-y-2">
        {reactionDetails?.map((detail, i) => (
          <p key={i}>{detail}</p>
        ))}
        {reactions?.length > 0 && (
          <StepReaction reactions={reactions} expanded={true} />
        )}
      </div>
    </div>
  );
}

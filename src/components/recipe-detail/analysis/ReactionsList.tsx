
import React, { useState } from 'react';
import { Beaker, Filter } from "lucide-react";
import { StepReactionItem } from './StepReactionItem';
import { Button } from '@/components/ui/button';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface ReactionsListProps {
  stepReactions: StepReaction[];
}

export function ReactionsList({ stepReactions }: ReactionsListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  if (!stepReactions || stepReactions.length === 0) return null;
  
  // Extract unique reaction types across all steps
  const allReactionTypes = new Set<string>();
  stepReactions.forEach(reaction => {
    reaction.reactions?.forEach(r => allReactionTypes.add(r));
  });
  
  // Filter steps if a filter is active
  const filteredReactions = filter 
    ? stepReactions.filter(reaction => reaction.reactions?.includes(filter)) 
    : stepReactions;
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
        <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
        Step-by-Step Reaction Analysis
      </h3>
      
      {/* Filter by reaction type */}
      {allReactionTypes.size > 0 && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-slate-600 mb-2">
            <Filter className="h-4 w-4 mr-1" />
            <span>Filter by reaction type:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {Array.from(allReactionTypes).map(type => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                className={filter === type ? "bg-recipe-blue text-white" : "text-slate-700"}
                onClick={() => setFilter(filter === type ? null : type)}
              >
                {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Button>
            ))}
            
            {filter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter(null)}
              >
                Clear filter
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {filteredReactions.map((reaction, index) => (
          <StepReactionItem 
            key={`reaction-${reaction.step_index}`}
            reaction={reaction}
            index={reaction.step_index}
          />
        ))}
        
        {filter && filteredReactions.length === 0 && (
          <p className="text-muted-foreground italic">
            No steps found with the selected reaction type.
          </p>
        )}
      </div>
    </div>
  );
}

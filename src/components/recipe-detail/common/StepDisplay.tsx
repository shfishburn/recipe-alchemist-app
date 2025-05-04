
import React, { useState, useCallback, memo } from 'react';
import { Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepReaction, formatReactionName } from '@/hooks/use-recipe-science';
import { cn } from '@/lib/utils';
import { StepCategoryLabel } from './StepCategoryLabel';
import type { StepCategory } from './StepCategoryLabel';

interface StepDisplayProps {
  stepNumber: number;
  stepText: string;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  stepReaction?: StepReaction | null;
  variant: 'instruction' | 'cooking';
  stepCategory?: StepCategory | string;
}

// Use memo for the entire component to prevent unnecessary re-renders
export const StepDisplay = memo(function StepDisplay({
  stepNumber,
  stepText,
  isCompleted = false,
  onToggleComplete,
  stepReaction,
  variant,
  stepCategory
}: StepDisplayProps) {
  const [showScience, setShowScience] = useState<boolean>(false);
  
  // Determine if this step has scientific data
  const hasScience = stepReaction && 
                     Array.isArray(stepReaction.reactions) && 
                     stepReaction.reactions.length > 0;
    
  // Memoize the science toggle handler
  const handleScienceClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowScience(prev => !prev);
  }, []);
  
  // Styling classes based on state
  const containerClasses = cn(
    "flex flex-col p-4 rounded-md transition-colors border hw-accelerated",
    isCompleted ? "bg-green-50 hover:bg-green-100 border-green-200" : "hover:bg-gray-50 border-gray-100",
    onToggleComplete ? "cursor-pointer" : "",
    variant === 'cooking' ? "shadow-sm" : ""
  );
  
  const textClasses = cn(
    "text-lg leading-relaxed",
    isCompleted ? "line-through text-muted-foreground" : "text-foreground"
  );
  
  return (
    <>
      <div onClick={onToggleComplete} className={containerClasses}>
        {/* Step header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex-shrink-0 font-semibold px-2.5 py-1 rounded-md",
              isCompleted ? "bg-green-100 text-green-700" : "bg-recipe-blue/10 text-recipe-blue"
            )}>
              Step {stepNumber}
            </span>
            
            {stepCategory && <StepCategoryLabel category={stepCategory} />}
          </div>
          
          {/* Science button */}
          {hasScience && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleScienceClick}
              className="ml-auto flex-shrink-0 gap-1.5"
              title={showScience ? "Hide Science" : "View Science"}
            >
              <Atom className="h-4 w-4 text-recipe-blue" />
              <span>{showScience ? "Hide Science" : "Science"}</span>
            </Button>
          )}
        </div>
        
        {/* Step content */}
        <p className={textClasses}>{stepText}</p>
      </div>
      
      {/* Science info panel */}
      {hasScience && showScience && stepReaction && (
        <div className="ml-6 mt-2 p-4 bg-blue-50 rounded-md border border-blue-100 shadow-sm hw-accelerated">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Atom className="h-4 w-4 mr-1.5" />
            <span>Scientific Explanation</span>
          </h4>
          
          {/* Reaction details */}
          {stepReaction.reaction_details?.map((detail, i) => (
            <p key={i} className="text-sm text-blue-700 leading-relaxed mb-2">{detail}</p>
          ))}
          
          {/* Reaction tags */}
          {stepReaction.reactions?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 mt-2 border-t border-blue-200">
              {stepReaction.reactions.map((type, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {formatReactionName(type)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
});

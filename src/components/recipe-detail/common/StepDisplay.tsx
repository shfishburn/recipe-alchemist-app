
import React, { useState } from 'react';
import { Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepReaction, formatReactionName } from '@/hooks/use-recipe-science';
import { cn } from '@/lib/utils';

interface StepDisplayProps {
  stepNumber: number;
  stepText: string;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  stepReaction?: StepReaction | null;
  variant: 'instruction' | 'cooking';
}

/**
 * Standardized component for displaying recipe steps with consistent science data integration
 */
export function StepDisplay({
  stepNumber,
  stepText,
  isCompleted = false,
  onToggleComplete,
  stepReaction,
  variant
}: StepDisplayProps) {
  const [showScience, setShowScience] = useState<boolean>(false);
  
  // Determine if this step has scientific data
  const hasScience = !!stepReaction && 
    Array.isArray(stepReaction.reactions) && 
    stepReaction.reactions.length > 0;
    
  // Handle science toggle with proper event handling
  const handleScienceToggle = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (hasScience) {
      e.stopPropagation();
      e.preventDefault();
      setShowScience(prev => !prev);
    }
  }, [hasScience]);
  
  // Handle step click
  const handleStepClick = React.useCallback(() => {
    if (onToggleComplete) {
      onToggleComplete();
    }
  }, [onToggleComplete]);
  
  // Determine the correct CSS classes based on variant and completed state
  const containerClasses = cn(
    "flex flex-col cursor-pointer p-4 rounded-md transition-colors border",
    isCompleted ? 
      "bg-green-50 hover:bg-green-100 border-green-200" : 
      "hover:bg-gray-50 border-gray-100",
    variant === 'cooking' ? "shadow-sm" : ""
  );
  
  const textClasses = cn(
    "text-lg leading-relaxed",
    isCompleted ? "line-through text-muted-foreground" : "text-foreground"
  );
  
  return (
    <div className="mb-3">
      <div 
        onClick={handleStepClick}
        className={containerClasses}
      >
        {/* Step header with step number and science toggle */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            "flex-shrink-0 font-semibold px-2.5 py-1 rounded-md",
            isCompleted ? "bg-green-100 text-green-700" : "bg-recipe-blue/10 text-recipe-blue"
          )}>
            Step {stepNumber}
          </span>
          
          {/* Science button - only shown if step has science data */}
          {hasScience && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleScienceToggle}
              className="ml-auto flex-shrink-0 gap-1.5"
              title={showScience ? "Hide Science" : "View Science"}
            >
              <Atom className="h-4 w-4 text-recipe-blue" />
              <span>{showScience ? "Hide Science" : "Science"}</span>
            </Button>
          )}
        </div>
        
        {/* Step content */}
        <p className={textClasses}>
          {stepText}
        </p>
      </div>
      
      {/* Science note - only shown if step has science data and showScience is true */}
      {hasScience && showScience && stepReaction && (
        <div className="ml-6 mt-2 p-4 bg-blue-50 rounded-md border border-blue-100 shadow-sm">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <Atom className="h-4 w-4 mr-1.5" />
            <span>Scientific Explanation</span>
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            {stepReaction.reaction_details?.map((detail, i) => (
              <p key={i} className="leading-relaxed">{detail}</p>
            ))}
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
        </div>
      )}
    </div>
  );
}

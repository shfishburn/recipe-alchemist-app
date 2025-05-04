
import React, { useState } from 'react';
import { Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepReaction, formatReactionName } from '@/hooks/use-recipe-science';

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
  const containerClasses = variant === 'cooking'
    ? `flex flex-col cursor-pointer p-3 rounded-md transition-colors ${
        isCompleted ? "bg-green-50 hover:bg-green-100" : "hover:bg-muted/50"
      }`
    : `flex flex-col cursor-pointer p-3 rounded-md transition-colors ${
        isCompleted ? "bg-green-50 hover:bg-green-100" : "hover:bg-muted/50"
      }`;
  
  const textClasses = isCompleted 
    ? "line-through text-muted-foreground" 
    : "";
  
  return (
    <div>
      <div 
        onClick={handleStepClick}
        className={containerClasses}
      >
        {/* Step header with step number and science toggle */}
        <div className="flex items-center justify-between mb-2">
          <span className={`flex-shrink-0 mr-2 font-medium ${
            isCompleted ? "text-muted-foreground" : "text-foreground"
          }`}>
            Step {stepNumber}
          </span>
          
          {/* Science button - only shown if step has science data */}
          {hasScience && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScienceToggle}
              className="h-6 w-6 ml-auto flex-shrink-0"
              title={showScience ? "Hide Science" : "View Science"}
            >
              <Atom className="h-4 w-4 text-blue-600" />
            </Button>
          )}
        </div>
        
        {/* Step content */}
        <p className={`text-lg leading-relaxed ${textClasses}`}>
          {stepText}
        </p>
      </div>
      
      {/* Science note - only shown if step has science data and showScience is true */}
      {hasScience && showScience && stepReaction && (
        <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
            <Atom className="h-4 w-4 mr-1" />
            <span>Science Notes</span>
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            {stepReaction.reaction_details?.map((detail, i) => (
              <p key={i}>{detail}</p>
            ))}
            {stepReaction.reactions?.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {stepReaction.reactions.map((type, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
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

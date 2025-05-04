
import React from 'react';
import { FormatIngredientText } from '../instructions/FormatIngredientText';
import { StepHeader } from '../instructions/StepHeader';

interface CookingStepProps {
  stepNumber: number;
  instruction: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  hasScience?: boolean;
  onToggleScience?: () => void;
  showingScience?: boolean;
}

export function CookingStep({ 
  stepNumber, 
  instruction, 
  isCompleted, 
  onToggleComplete,
  hasScience,
  onToggleScience,
  showingScience
}: CookingStepProps) {
  // Create handler to prevent bubbling for science toggle with better touch handling
  const handleScienceToggle = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (onToggleScience) {
      e.stopPropagation();
      e.preventDefault();
      onToggleScience();
    }
  }, [onToggleScience]);
  
  // Handle step click with better event handling
  const handleStepClick = React.useCallback(() => {
    onToggleComplete();
  }, [onToggleComplete]);
  
  return (
    <div className="mb-4">
      <div 
        onClick={handleStepClick}
        className={`flex flex-col cursor-pointer p-3 rounded-md transition-colors ${
          isCompleted ? "bg-green-50 hover:bg-green-100" : "hover:bg-muted/50"
        }`}
      >
        {/* Step Header */}
        <StepHeader 
          stepNumber={stepNumber}
          isCompleted={isCompleted}
          hasScience={!!hasScience}
          showingScience={!!showingScience}
          onToggleScience={hasScience ? handleScienceToggle : undefined}
        />
        
        {/* Step content */}
        <p className={`text-lg leading-relaxed ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
          <FormatIngredientText text={instruction} />
        </p>
      </div>
    </div>
  );
}


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
  // Create handler to prevent bubbling for science toggle
  const handleScienceToggle = (e: React.MouseEvent) => {
    if (onToggleScience) {
      e.stopPropagation();
      onToggleScience();
    }
  };
  
  return (
    <div className="mb-4">
      <div 
        onClick={onToggleComplete}
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
          onToggleScience={handleScienceToggle}
        />
        
        {/* Step content */}
        <p className={`text-lg leading-relaxed ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
          <FormatIngredientText text={instruction} />
        </p>
      </div>
    </div>
  );
}

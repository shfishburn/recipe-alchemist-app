
import React from 'react';
import { Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormatIngredientText } from '../instructions/FormatIngredientText';

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
  return (
    <div className="mb-4">
      <div 
        onClick={onToggleComplete}
        className={`flex flex-col cursor-pointer p-3 rounded-md transition-colors ${
          isCompleted ? "bg-green-50 hover:bg-green-100" : "hover:bg-muted/50"
        }`}
      >
        {/* Step Header */}
        <div className="flex items-center justify-between mb-2">
          <span className={`flex-shrink-0 mr-2 font-medium ${
            isCompleted ? "text-muted-foreground" : "text-foreground"
          }`}>
            {stepNumber}.
          </span>
          
          {/* Science button - only if has science */}
          {hasScience && onToggleScience && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleScience();
              }}
              className="h-6 w-6 ml-auto flex-shrink-0"
              title={showingScience ? "Hide Science" : "View Science"}
            >
              <Atom className="h-4 w-4 text-blue-600" />
            </Button>
          )}
        </div>
        
        {/* Step content */}
        <p className={`text-lg leading-relaxed ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
          <FormatIngredientText text={instruction} />
        </p>
      </div>
    </div>
  );
}


import React from 'react';
import { Check, Square, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  // Function to process markdown-style bold text
  const renderInstructionWithBoldIngredients = (instruction: string) => {
    // Split by bold markers
    const parts = instruction.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, i) => {
      // Check if this part is wrapped in bold markers
      if (part.startsWith('**') && part.endsWith('**')) {
        // Extract content between ** markers and render as styled ingredient
        const content = part.substring(2, part.length - 2);
        return (
          <span 
            key={i} 
            className="font-semibold text-recipe-blue bg-recipe-blue/5 px-1.5 py-0.5 rounded-md border border-recipe-blue/10"
          >
            {content}
          </span>
        );
      }
      // Return regular text
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-start">
        {/* Compact step number */}
        <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-recipe-blue/10 text-recipe-blue font-medium mr-3">
          {stepNumber}
        </div>
        
        {/* Step content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Step {stepNumber}</h2>
            <div className="flex items-center space-x-1">
              {/* Science button - only if has science */}
              {hasScience && onToggleScience && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleScience}
                  className="h-8 w-8"
                  title={showingScience ? "Hide Science" : "View Science"}
                >
                  <Atom className="h-4 w-4 text-blue-600" />
                </Button>
              )}
              
              {/* Complete button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={onToggleComplete}
                className="flex items-center gap-1 h-8"
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="text-xs sm:text-sm">
                  {isCompleted ? "Done" : "Mark Done"}
                </span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg border p-4 bg-background mt-3">
            <p className="text-lg leading-relaxed">
              {renderInstructionWithBoldIngredients(instruction)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

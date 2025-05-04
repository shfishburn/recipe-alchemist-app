
import React from 'react';
import { Atom } from 'lucide-react';
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
      <div 
        onClick={onToggleComplete}
        className={`flex items-start cursor-pointer p-3 rounded-md transition-colors ${
          isCompleted ? "bg-green-50 hover:bg-green-100" : "hover:bg-muted/50"
        }`}
      >
        {/* Minimal step number */}
        <span className="flex-shrink-0 mr-3 font-medium text-muted-foreground">
          {stepNumber}.
        </span>
        
        {/* Step content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className={`text-lg leading-relaxed ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
              {renderInstructionWithBoldIngredients(instruction)}
            </p>
            
            {/* Science button - only if has science */}
            {hasScience && onToggleScience && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleScience();
                }}
                className="h-8 w-8 ml-2 flex-shrink-0"
                title={showingScience ? "Hide Science" : "View Science"}
              >
                <Atom className="h-4 w-4 text-blue-600" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

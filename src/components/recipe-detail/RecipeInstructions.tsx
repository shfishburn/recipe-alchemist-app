
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, ChevronDown, ChevronUp, Check } from 'lucide-react';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeInstructionsProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function RecipeInstructions({ recipe, isOpen, onToggle }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<{[key: number]: boolean}>({});
  
  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Enhanced function to process markdown-style bold ingredient text
  const renderInstructionWithBoldIngredients = (instruction: string) => {
    // Split by bold markers
    const parts = instruction.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, i) => {
      // Check if this part is wrapped in bold markers
      if (part.startsWith('**') && part.endsWith('**')) {
        // Extract content between ** markers and render as bold with special styling
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
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-recipe-blue" />
              Instructions
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle instructions</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="group">
                    <div 
                      className={`flex items-start gap-3 p-2 rounded-md transition-colors ${
                        completedSteps[index] 
                          ? "bg-green-50 hover:bg-green-100" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => toggleStep(index)}
                    >
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-recipe-blue/10 text-recipe-blue font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-0.5 flex items-center justify-between">
                        <p className={`leading-relaxed ${completedSteps[index] ? "line-through text-muted-foreground" : ""}`}>
                          {renderInstructionWithBoldIngredients(step)}
                        </p>
                        {completedSteps[index] && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    {index < recipe.instructions.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground">No instructions available</p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { Recipe } from '@/hooks/use-recipe-detail';
import { InstructionStep } from './instructions/InstructionStep';
import { useStepReactions, getStepReaction } from './instructions/useStepReactions';
import { useStepCompletion } from './instructions/useStepCompletion';

interface RecipeInstructionsProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function RecipeInstructions({ recipe, isOpen, onToggle }: RecipeInstructionsProps) {
  // Use our new custom hook for step completion
  const { toggleStep, isStepCompleted } = useStepCompletion();
  
  // Fetch reaction data for this recipe
  const { data: stepReactions } = useStepReactions(recipe.id);
  
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
                {recipe.instructions.map((step, index) => {
                  const stepReaction = getStepReaction(stepReactions, index);
                  const isLastStep = index === recipe.instructions.length - 1;
                  
                  return (
                    <InstructionStep
                      key={index}
                      step={step}
                      index={index}
                      isCompleted={isStepCompleted(index)}
                      toggleStep={toggleStep}
                      stepReaction={stepReaction}
                      isLastStep={isLastStep}
                    />
                  );
                })}
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


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { InstructionStep } from './instructions/InstructionStep';
import { useStepCompletion } from './instructions/useStepCompletion';
import { useRecipeScience, getStepReaction } from '@/hooks/use-recipe-science';

interface RecipeInstructionsProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function RecipeInstructions({ recipe, isOpen, onToggle }: RecipeInstructionsProps) {
  const { toggleStep, isStepCompleted } = useStepCompletion();
  const { stepReactions } = useRecipeScience(recipe);
  
  const hasInstructions = recipe.instructions && recipe.instructions.length > 0;
  
  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-recipe-blue" />
              Instructions
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle instructions</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0 px-4">
            {hasInstructions ? (
              <ol className="space-y-4 w-full">
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
      </Collapsible>
    </Card>
  );
}

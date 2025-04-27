
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeInstructionsProps {
  recipe: Recipe;
}

export function RecipeInstructions({ recipe }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<{[key: number]: boolean}>({});
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-recipe-blue" />
            Instructions
          </CardTitle>
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
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
      <CollapsibleContent forceMount className={!isOpen ? "hidden" : ""}>
        <CardContent className="pt-0">
          {recipe.instructions && recipe.instructions.length > 0 ? (
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="group">
                  <div className="flex items-start gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-recipe-blue/10 text-recipe-blue font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p className={completedSteps[index] ? "line-through text-muted-foreground" : ""}>{step}</p>
                      </div>
                    </div>
                    <Checkbox 
                      id={`step-${index}`}
                      checked={completedSteps[index] || false}
                      onCheckedChange={() => toggleStep(index)}
                      className="mt-0.5"
                    />
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
  );
}

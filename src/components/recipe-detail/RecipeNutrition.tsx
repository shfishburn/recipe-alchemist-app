
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NutritionHeader } from './nutrition/NutritionHeader';
import { useNutritionData } from './nutrition/useNutritionData';
import { NutritionBlock } from './nutrition/NutritionBlock';
import type { Recipe } from '@/types/recipe';

interface RecipeNutritionProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function RecipeNutrition({ recipe, isOpen, onToggle }: RecipeNutritionProps) {
  const { user, profile } = useAuth();
  const [viewMode, setViewMode] = useState<'recipe' | 'personal'>('recipe');
  const { recipeNutrition, userPreferences } = useNutritionData(recipe, profile);

  if (!recipeNutrition) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="w-full">
        <div className="flex items-center justify-between p-6 pb-3">
          <NutritionHeader
            showToggle={!!user && !!userPreferences}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle nutrition section</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <CardContent>
            <NutritionBlock 
              recipeNutrition={recipeNutrition}
              userPreferences={userPreferences}
              viewMode={viewMode}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

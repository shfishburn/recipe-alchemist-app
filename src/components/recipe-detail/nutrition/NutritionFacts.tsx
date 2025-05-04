
import React from 'react';
import { NutriScoreScale } from './NutriScoreScale';
import { NutriScoreBadge } from './NutriScoreBadge';
import type { Recipe } from '@/types/recipe';
import { useNutriScore } from '@/hooks/use-nutri-score';

interface NutritionFactsProps {
  recipe: Recipe;
}

export function NutritionFacts({ recipe }: NutritionFactsProps) {
  const { grade, positives, negatives, hasData } = useNutriScore(recipe);
  
  if (!hasData) {
    return (
      <div className="p-4 rounded-md border bg-muted/50">
        <p className="text-center text-muted-foreground">
          Nutrition data not available for this recipe.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nutri-Score</h3>
        <NutriScoreBadge grade={grade} showLabel={true} />
      </div>
      
      <NutriScoreScale activeGrade={grade} />
      
      <div className="grid gap-4 md:grid-cols-2">
        {positives.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Positive Nutrients</h4>
            <ul className="space-y-1.5">
              {positives.map((positive, index) => (
                <li key={index} className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="flex-grow">{positive.name}</span>
                  {positive.value && <span className="text-muted-foreground">{positive.value}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {negatives.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Nutrients to Watch</h4>
            <ul className="space-y-1.5">
              {negatives.map((negative, index) => (
                <li key={index} className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  <span className="flex-grow">{negative.name}</span>
                  {negative.value && <span className="text-muted-foreground">{negative.value}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}


import React from 'react';
import { Button } from '@/components/ui/button';
import { NutriScoreDetail } from './NutriScoreDetail';
import { useNutriScore } from '@/hooks/use-nutri-score';
import { CircleCheck, BarChart, Loader2 } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface NutriScoreSectionProps {
  recipe: Recipe;
}

export function NutriScoreSection({ recipe }: NutriScoreSectionProps) {
  const { 
    nutriScore, 
    isLoading, 
    calculateNutriScore, 
    isCalculating,
    shouldCalculate
  } = useNutriScore(recipe);

  return (
    <div className="space-y-4">
      <NutriScoreDetail nutriScore={nutriScore} />
      
      {shouldCalculate && (
        <div className="flex justify-center">
          <Button 
            onClick={() => calculateNutriScore()} 
            disabled={isCalculating || !recipe.nutrition}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            {isCalculating ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <BarChart className="h-4 w-4 mr-1" />
                Calculate Nutri-Score
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Generate a nutrition grade for this recipe based on its nutritional content.
          </p>
        </div>
      )}
      
      {nutriScore?.calculated_at && (
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <CircleCheck className="h-3 w-3 text-green-500" />
          <span>
            Calculated {new Date(nutriScore.calculated_at).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}

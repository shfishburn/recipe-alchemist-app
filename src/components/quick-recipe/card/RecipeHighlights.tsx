
import React from 'react';
import { LightbulbIcon, ActivityIcon } from 'lucide-react';
import { NutriScoreBadge } from '@/components/recipe-detail/nutrition/nutri-score/NutriScoreBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface RecipeHighlightsProps {
  nutritionHighlight?: string;
  cookingTip?: string;
  nutriScore?: {
    grade: string;
    score: number;
  };
}

export function RecipeHighlights({ nutritionHighlight, cookingTip, nutriScore }: RecipeHighlightsProps) {
  const isMobile = useIsMobile();
  
  if (!nutritionHighlight && !cookingTip && !nutriScore) return null;
  
  return (
    <div className={cn(
      "grid gap-3", 
      nutriScore ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
    )}>
      {nutritionHighlight && (
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-1">
            <ActivityIcon className="h-4 w-4 text-blue-500" />
            Nutrition Highlight
          </p>
          <p className="text-sm text-muted-foreground">{nutritionHighlight}</p>
        </div>
      )}
      
      {cookingTip && (
        <div className="bg-recipe-orange/10 p-3 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-1">
            <LightbulbIcon className="h-4 w-4 text-recipe-orange" />
            Cooking Tip
          </p>
          <p className="text-sm text-muted-foreground">{cookingTip}</p>
        </div>
      )}
      
      {nutriScore && (
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm font-medium flex items-center gap-1">
            <ActivityIcon className="h-4 w-4 text-green-600" />
            Nutrition Quality
          </p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-muted-foreground">
              This recipe has a NutriScore rating:
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <NutriScoreBadge nutriScore={nutriScore} size={isMobile ? "sm" : "md"} />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">
                    NutriScore {nutriScore.grade} - {getNutriScoreDescription(nutriScore.grade)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
}

function getNutriScoreDescription(grade: string): string {
  switch (grade) {
    case 'A':
      return 'Excellent nutritional quality';
    case 'B':
      return 'Good nutritional quality';
    case 'C':
      return 'Average nutritional quality';
    case 'D':
      return 'Poor nutritional quality';
    case 'E':
      return 'Very poor nutritional quality';
    default:
      return 'Unknown nutritional quality';
  }
}

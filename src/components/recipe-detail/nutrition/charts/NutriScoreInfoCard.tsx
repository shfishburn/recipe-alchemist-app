
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NutriScoreBadge } from '@/components/recipe-detail/nutrition/nutri-score/NutriScoreBadge';
import { Progress } from '@/components/ui/progress';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface NutriScoreInfoCardProps {
  nutriScore: {
    grade: string;
    score: number;
    negative_points?: {
      total: number;
      energy: number;
      saturated_fat: number;
      sugars: number;
      sodium: number;
    };
    positive_points?: {
      total: number;
      fiber: number;
      protein: number;
      fruit_veg_nuts: number;
    };
  };
}

export function NutriScoreInfoCard({ nutriScore }: NutriScoreInfoCardProps) {
  const isMobile = useIsMobile();
  
  // Max score for scaling: the Nutri-Score scale typically goes from -15 to +40
  const maxScore = 40;
  const minScore = -15;
  const scoreRange = maxScore - minScore;
  
  // Normalize the score to a 0-100 scale for the progress bar
  const normalizedScore = Math.max(0, Math.min(100, ((nutriScore.score - minScore) / scoreRange) * 100));
  
  // Determine progress color based on grade
  const progressColor = getProgressColorByGrade(nutriScore.grade);
  
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NutriScoreBadge nutriScore={nutriScore} size={isMobile ? "sm" : "md"} />
            <div>
              <p className="font-medium text-sm">NutriScore {nutriScore.grade}</p>
              <p className="text-xs text-muted-foreground">Nutritional quality indicator</p>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-xs">
                  NutriScore is a nutrition label that converts the nutritional value of products 
                  into a simple score, with grades from A (best) to E (worst), 
                  helping you make healthier food choices at a glance.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span>Score: {nutriScore.score}</span>
            <span className="text-muted-foreground">Range: {minScore} to {maxScore}</span>
          </div>
          <Progress 
            value={normalizedScore} 
            className="h-2" 
            indicatorColor={progressColor}
          />
        </div>
        
        <p className="text-xs text-muted-foreground">
          {getNutriScoreDescription(nutriScore.grade)}
        </p>
        
        <div className="text-[11px] text-muted-foreground pt-1 border-t border-gray-100">
          <p>
            NutriScore considers nutrients to limit (calories, saturated fat, sugars, sodium) 
            and beneficial nutrients (fiber, protein, fruits/vegetables).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getNutriScoreDescription(grade: string): string {
  switch (grade) {
    case 'A':
      return 'This recipe has excellent nutritional quality with balanced nutrients and limited unhealthy components.';
    case 'B':
      return 'This recipe has good nutritional quality with moderately balanced nutrients.';
    case 'C':
      return 'This recipe has average nutritional quality with some areas for improvement.';
    case 'D':
      return 'This recipe has poor nutritional quality and should be consumed in moderation.';
    case 'E':
      return 'This recipe has very poor nutritional quality and contains high amounts of unhealthy components.';
    default:
      return 'This recipe has not been fully analyzed for nutritional quality.';
  }
}

function getProgressColorByGrade(grade: string): string {
  switch (grade) {
    case 'A':
      return 'rgb(34, 197, 94, 0.9)'; // Green
    case 'B':
      return 'rgb(132, 204, 22, 0.9)'; // Lime
    case 'C':
      return 'rgb(245, 158, 11, 0.9)'; // Amber
    case 'D':
      return 'rgb(249, 115, 22, 0.9)'; // Orange
    case 'E':
      return 'rgb(239, 68, 68, 0.9)'; // Red
    default:
      return 'rgba(156, 163, 175, 0.9)'; // Gray
  }
}

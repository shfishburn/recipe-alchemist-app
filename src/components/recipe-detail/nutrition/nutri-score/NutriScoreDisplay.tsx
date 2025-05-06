
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { NutriScoreBadge } from './NutriScoreBadge';
import { NutriScoreTooltip } from './NutriScoreTooltip';
import type { NutriScore } from '@/types/recipe';
import { cn } from '@/lib/utils';

interface NutriScoreDisplayProps {
  nutriScore: NutriScore;
  compact?: boolean;
  className?: string;
}

export function NutriScoreDisplay({ nutriScore, compact = false, className }: NutriScoreDisplayProps) {
  const { score, grade, negative_points, positive_points } = nutriScore;
  
  // Max score for scaling: the Nutri-Score scale typically goes from -15 to +40
  const maxScore = 40;
  const minScore = -15;
  const scoreRange = maxScore - minScore;
  
  // Normalize the score to a 0-100 scale for the progress bar
  const normalizedScore = Math.max(0, Math.min(100, ((score - minScore) / scoreRange) * 100));
  
  // Determine progress color based on grade
  const progressColor = getProgressColorByGrade(grade);
  
  if (compact) {
    return (
      <div className={cn("flex items-center", className)}>
        <NutriScoreBadge nutriScore={nutriScore} size="md" showTooltip={false} />
        <div className="ml-2">
          <h4 className="text-sm font-medium">NutriScore {grade}</h4>
          <p className="text-xs text-muted-foreground">Score: {score}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <NutriScoreBadge nutriScore={nutriScore} size="lg" showTooltip={false} />
          <div className="ml-3">
            <h3 className="text-base font-semibold">NutriScore {grade}</h3>
            <p className="text-sm text-muted-foreground">Nutritional quality score</p>
          </div>
        </div>
        <NutriScoreTooltip />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Score: {score}</span>
          <span className="text-xs text-muted-foreground">Range: {minScore} to {maxScore}</span>
        </div>
        <Progress 
          value={normalizedScore} 
          className="h-2" 
          indicatorColor={progressColor}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <h4 className="text-xs uppercase text-muted-foreground">Negative Points</h4>
          <p className="text-sm font-semibold">{negative_points.total}</p>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span>Energy</span>
              <span>{negative_points.energy}</span>
            </div>
            <div className="flex justify-between">
              <span>Saturated Fat</span>
              <span>{negative_points.saturated_fat}</span>
            </div>
            <div className="flex justify-between">
              <span>Sugars</span>
              <span>{negative_points.sugars}</span>
            </div>
            <div className="flex justify-between">
              <span>Sodium</span>
              <span>{negative_points.sodium}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-xs uppercase text-muted-foreground">Positive Points</h4>
          <p className="text-sm font-semibold">{positive_points.total}</p>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span>Fiber</span>
              <span>{positive_points.fiber}</span>
            </div>
            <div className="flex justify-between">
              <span>Protein</span>
              <span>{positive_points.protein}</span>
            </div>
            <div className="flex justify-between">
              <span>Fruits/Vegetables/Nuts</span>
              <span>{positive_points.fruit_veg_nuts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

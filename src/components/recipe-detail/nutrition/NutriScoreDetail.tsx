
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Info, CircleCheck, CircleX } from 'lucide-react';
import { NutriScoreBadge } from './NutriScoreBadge';
import type { NutriScore } from '@/types/recipe';

interface NutriScoreDetailProps {
  nutriScore: NutriScore | null | undefined;
}

export function NutriScoreDetail({ nutriScore }: NutriScoreDetailProps) {
  if (!nutriScore || !nutriScore.grade) {
    return (
      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Nutri-Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              Nutri-Score not available for this recipe
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentages for the progress bars
  const negativePoints = nutriScore.negative_points.total || 0;
  const positivePoints = nutriScore.positive_points.total || 0;
  
  // Max points for reference (based on Nutri-Score documentation)
  const maxNegative = 40;
  const maxPositive = 15;
  
  const negativePercentage = Math.min((negativePoints / maxNegative) * 100, 100);
  const positivePercentage = Math.min((positivePoints / maxPositive) * 100, 100);

  return (
    <Card className="bg-muted/40">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Nutri-Score</CardTitle>
          <NutriScoreBadge nutriScore={nutriScore} size="md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Unfavorable nutrients</span>
              <span className="text-xs font-medium">{negativePoints} pts</span>
            </div>
            <Progress 
              value={negativePercentage} 
              className="h-2 bg-gray-200" 
              indicatorClassName="bg-red-400"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Energy: </span>
                <span className="font-medium">{nutriScore.negative_points.energy || 0} pts</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Saturated Fat: </span>
                <span className="font-medium">{nutriScore.negative_points.saturated_fat || 0} pts</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Sugars: </span>
                <span className="font-medium">{nutriScore.negative_points.sugars || 0} pts</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Sodium: </span>
                <span className="font-medium">{nutriScore.negative_points.sodium || 0} pts</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Favorable nutrients</span>
              <span className="text-xs font-medium">{positivePoints} pts</span>
            </div>
            <Progress 
              value={positivePercentage} 
              className="h-2 bg-gray-200" 
              indicatorClassName="bg-green-400"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Fiber: </span>
                <span className="font-medium">{nutriScore.positive_points.fiber || 0} pts</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Protein: </span>
                <span className="font-medium">{nutriScore.positive_points.protein || 0} pts</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Fruits/Veg/Nuts: </span>
                <span className="font-medium">{nutriScore.positive_points.fruit_veg_nuts || 0} pts</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            <p>Final score: {nutriScore.score} points (lower is better)</p>
            <p className="mt-1">
              Calculated based on nutritional content per 100g.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

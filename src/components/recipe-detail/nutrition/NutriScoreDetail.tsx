
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

  // Calculate percentages for visualization
  const negativePoints = nutriScore.negative_points?.total || 0;
  const positivePoints = nutriScore.positive_points?.total || 0;
  const maxPoints = 40; // Maximum possible points in Nutri-Score system
  
  const negativePercentage = Math.min(100, (negativePoints / maxPoints) * 100);
  const positivePercentage = Math.min(100, (positivePoints / maxPoints) * 100);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center justify-between">
          <span>Nutri-Score</span>
          <NutriScoreBadge grade={nutriScore.grade} size="sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score explanation */}
        <p className="text-xs text-muted-foreground">
          Nutri-Score rates foods from A (healthiest) to E (less nutritious) based on nutrients.
        </p>
        
        {/* Negative points */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Negative Points</span>
            <span className="text-red-500 font-medium">{negativePoints}</span>
          </div>
          <Progress 
            value={negativePercentage} 
            className="h-2" 
            indicatorColor="#ef4444"
          />
          <div className="flex justify-between items-center mt-2 gap-1">
            <div className="flex items-center gap-1">
              <CircleX className="h-3 w-3 text-red-500" />
              <span className="text-xs text-muted-foreground">Energy, Sugars, Sat. Fat, Sodium</span>
            </div>
          </div>
        </div>
        
        {/* Positive points */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Positive Points</span>
            <span className="text-green-500 font-medium">{positivePoints}</span>
          </div>
          <Progress 
            value={positivePercentage} 
            className="h-2" 
            indicatorColor="#22c55e"
          />
          <div className="flex justify-between items-center mt-2 gap-1">
            <div className="flex items-center gap-1">
              <CircleCheck className="h-3 w-3 text-green-500" />
              <span className="text-xs text-muted-foreground">Fiber, Protein, Fruits/Veg</span>
            </div>
          </div>
        </div>
        
        {/* Final score */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-medium">Final Score:</span>
          <span className="text-xs font-semibold">
            {nutriScore.score} ({nutriScore.grade})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NutriScoreBadge } from './NutriScoreBadge';
import { NutriScoreScale } from './NutriScoreScale';
import { NutritionalAttributes } from './NutritionalAttributes';
import { Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface NutritionalAnalysisProps {
  score: number | null;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  positives: Array<{
    name: string;
    type: 'positive';
    icon?: string;
    value?: string | number;
  }>;
  negatives: Array<{
    name: string;
    type: 'negative';
    icon?: string;
    value?: string | number;
  }>;
  servingSize?: number;
  healthScore?: 'low' | 'medium' | 'high' | null;
  className?: string;
}

export function NutritionalAnalysis({
  score,
  grade,
  positives,
  negatives,
  servingSize,
  healthScore,
  className
}: NutritionalAnalysisProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Nutritional Analysis</span>
          <NutriScoreBadge grade={grade} size="md" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <NutriScoreScale activeGrade={grade} />
        
        <div className="rounded-md bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p>
              {grade === 'A' || grade === 'B' 
                ? 'This recipe has a good nutritional profile' 
                : grade === 'C' 
                  ? 'This recipe has a moderate nutritional profile' 
                  : 'This recipe could be nutritionally improved'}
            </p>
          </div>
        </div>
        
        {servingSize && (
          <div className="text-sm text-muted-foreground">
            Nutrition per serving ({servingSize}g)
          </div>
        )}
        
        <Separator />
        
        <NutritionalAttributes 
          positives={positives} 
          negatives={negatives} 
        />
        
        {healthScore && (
          <div className="mt-4 rounded-md bg-gray-50 p-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Health Score:</span>
              <div className={cn(
                "text-sm font-medium",
                healthScore === 'high' ? "text-green-600" : 
                healthScore === 'medium' ? "text-amber-600" : 
                "text-red-600"
              )}>
                {healthScore === 'high' ? "High" : 
                healthScore === 'medium' ? "Medium" : "Low"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

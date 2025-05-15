
import React from 'react';
import { NutritionImpact } from '@/hooks/recipe-modifications/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuickRecipeNutritionSummaryProps {
  nutrition: NutritionImpact;
}

function formatChange(value: number | undefined): string {
  if (value === undefined) return '';
  return value > 0 ? `+${value}` : `${value}`;
}

function getColorClass(value: number | undefined, positiveIsGood = false): string {
  if (value === undefined) return '';
  if (value === 0) return '';
  
  if (positiveIsGood) {
    return value > 0 ? 'text-green-500' : 'text-red-500';
  } else {
    return value > 0 ? 'text-red-500' : 'text-green-500';
  }
}

export const QuickRecipeNutritionSummary: React.FC<QuickRecipeNutritionSummaryProps> = ({ nutrition }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Nutrition Impact</span>
          {nutrition.assessment && (
            <Badge variant="outline" className="text-xs font-normal">
              {nutrition.assessment}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Impact of your modifications on nutritional content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {nutrition.summary && (
          <div className="text-sm text-muted-foreground">
            <p>{nutrition.summary}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Calories */}
          {nutrition.calories !== undefined && (
            <div className="bg-card border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Calories</p>
                <p className={`text-sm font-bold ${getColorClass(nutrition.calories)}`}>
                  {formatChange(nutrition.calories)}
                </p>
              </div>
            </div>
          )}

          {/* Protein */}
          {nutrition.protein !== undefined && (
            <div className="bg-card border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Protein</p>
                <p className={`text-sm font-bold ${getColorClass(nutrition.protein, true)}`}>
                  {formatChange(nutrition.protein)}g
                </p>
              </div>
            </div>
          )}

          {/* Carbs */}
          {nutrition.carbs !== undefined && (
            <div className="bg-card border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Carbs</p>
                <p className={`text-sm font-bold ${getColorClass(nutrition.carbs)}`}>
                  {formatChange(nutrition.carbs)}g
                </p>
              </div>
            </div>
          )}

          {/* Fat */}
          {nutrition.fat !== undefined && (
            <div className="bg-card border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Fat</p>
                <p className={`text-sm font-bold ${getColorClass(nutrition.fat)}`}>
                  {formatChange(nutrition.fat)}g
                </p>
              </div>
            </div>
          )}

          {/* Fiber */}
          {nutrition.fiber !== undefined && (
            <div className="bg-card border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Fiber</p>
                <p className={`text-sm font-bold ${getColorClass(nutrition.fiber, true)}`}>
                  {formatChange(nutrition.fiber)}g
                </p>
              </div>
            </div>
          )}

          {/* Sugar */}
          {nutrition.sugar !== undefined && (
            <div className="bg-card border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Sugar</p>
                <p className={`text-sm font-bold ${getColorClass(nutrition.sugar)}`}>
                  {formatChange(nutrition.sugar)}g
                </p>
              </div>
            </div>
          )}

          {/* Sodium */}
          {nutrition.sodium !== undefined && (
            <div className="bg-card border rounded-md p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Sodium</p>
                <p className={`text-sm font-bold ${getColorClass(nutrition.sodium)}`}>
                  {formatChange(nutrition.sodium)}mg
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

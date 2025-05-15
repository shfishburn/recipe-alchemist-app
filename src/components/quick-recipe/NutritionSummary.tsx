
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NutritionImpact } from '@/hooks/recipe-modifications/types';

interface NutritionSummaryProps {
  nutrition: NutritionImpact;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutrition }) => {
  if (!nutrition) return null;

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <h4 className="text-lg font-medium mb-2">Nutrition Impact</h4>
        {nutrition.assessment && <p className="text-sm mb-4">{nutrition.assessment}</p>}
        {nutrition.summary && <p className="text-sm italic text-muted-foreground">{nutrition.summary}</p>}
        
        <Separator className="my-3" />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {nutrition.calories !== undefined && (
            <div>
              <span className="font-medium">Calories:</span>{' '}
              <span className={nutrition.calories > 0 ? 'text-red-500' : nutrition.calories < 0 ? 'text-green-500' : ''}>
                {nutrition.calories > 0 ? '+' : ''}{nutrition.calories}
              </span>
            </div>
          )}
          {nutrition.protein !== undefined && (
            <div>
              <span className="font-medium">Protein:</span>{' '}
              <span className={nutrition.protein > 0 ? 'text-green-500' : nutrition.protein < 0 ? 'text-red-500' : ''}>
                {nutrition.protein > 0 ? '+' : ''}{nutrition.protein}g
              </span>
            </div>
          )}
          {nutrition.carbs !== undefined && (
            <div>
              <span className="font-medium">Carbs:</span>{' '}
              <span className={nutrition.carbs > 0 ? 'text-red-500' : nutrition.carbs < 0 ? 'text-green-500' : ''}>
                {nutrition.carbs > 0 ? '+' : ''}{nutrition.carbs}g
              </span>
            </div>
          )}
          {nutrition.fat !== undefined && (
            <div>
              <span className="font-medium">Fat:</span>{' '}
              <span className={nutrition.fat > 0 ? 'text-red-500' : nutrition.fat < 0 ? 'text-green-500' : ''}>
                {nutrition.fat > 0 ? '+' : ''}{nutrition.fat}g
              </span>
            </div>
          )}
          {nutrition.fiber !== undefined && (
            <div>
              <span className="font-medium">Fiber:</span>{' '}
              <span className={nutrition.fiber > 0 ? 'text-green-500' : nutrition.fiber < 0 ? 'text-red-500' : ''}>
                {nutrition.fiber > 0 ? '+' : ''}{nutrition.fiber}g
              </span>
            </div>
          )}
          {nutrition.sugar !== undefined && (
            <div>
              <span className="font-medium">Sugar:</span>{' '}
              <span className={nutrition.sugar > 0 ? 'text-red-500' : nutrition.sugar < 0 ? 'text-green-500' : ''}>
                {nutrition.sugar > 0 ? '+' : ''}{nutrition.sugar}g
              </span>
            </div>
          )}
          {nutrition.sodium !== undefined && (
            <div>
              <span className="font-medium">Sodium:</span>{' '}
              <span className={nutrition.sodium > 0 ? 'text-red-500' : nutrition.sodium < 0 ? 'text-green-500' : ''}>
                {nutrition.sodium > 0 ? '+' : ''}{nutrition.sodium}mg
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

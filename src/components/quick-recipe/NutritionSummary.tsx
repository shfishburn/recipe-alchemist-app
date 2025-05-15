
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NutritionImpact } from '@/hooks/recipe-modifications/types';

interface NutritionSummaryProps {
  nutrition: NutritionImpact;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutrition }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Impact</CardTitle>
        <CardDescription>How this change affects the recipe's nutrition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {nutrition.summary && (
          <div className="text-sm">
            <p>{nutrition.summary}</p>
          </div>
        )}
        
        {nutrition.assessment && (
          <div className="text-sm">
            <p>{nutrition.assessment}</p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          {nutrition.calories !== undefined && (
            <div className="p-2 bg-secondary/20 rounded">
              <div className="text-xs uppercase font-medium">Calories</div>
              <div className={`text-sm font-bold ${nutrition.calories > 0 ? 'text-red-500' : nutrition.calories < 0 ? 'text-green-500' : ''}`}>
                {nutrition.calories > 0 ? '+' : ''}{nutrition.calories}
              </div>
            </div>
          )}
          
          {nutrition.protein !== undefined && (
            <div className="p-2 bg-secondary/20 rounded">
              <div className="text-xs uppercase font-medium">Protein</div>
              <div className={`text-sm font-bold ${nutrition.protein > 0 ? 'text-green-500' : nutrition.protein < 0 ? 'text-red-500' : ''}`}>
                {nutrition.protein > 0 ? '+' : ''}{nutrition.protein}g
              </div>
            </div>
          )}
          
          {nutrition.carbs !== undefined && (
            <div className="p-2 bg-secondary/20 rounded">
              <div className="text-xs uppercase font-medium">Carbs</div>
              <div className={`text-sm font-bold ${nutrition.carbs > 0 ? 'text-red-500' : nutrition.carbs < 0 ? 'text-green-500' : ''}`}>
                {nutrition.carbs > 0 ? '+' : ''}{nutrition.carbs}g
              </div>
            </div>
          )}
          
          {nutrition.fat !== undefined && (
            <div className="p-2 bg-secondary/20 rounded">
              <div className="text-xs uppercase font-medium">Fat</div>
              <div className={`text-sm font-bold ${nutrition.fat > 0 ? 'text-red-500' : nutrition.fat < 0 ? 'text-green-500' : ''}`}>
                {nutrition.fat > 0 ? '+' : ''}{nutrition.fat}g
              </div>
            </div>
          )}
          
          {nutrition.fiber !== undefined && (
            <div className="p-2 bg-secondary/20 rounded">
              <div className="text-xs uppercase font-medium">Fiber</div>
              <div className={`text-sm font-bold ${nutrition.fiber > 0 ? 'text-green-500' : nutrition.fiber < 0 ? 'text-red-500' : ''}`}>
                {nutrition.fiber > 0 ? '+' : ''}{nutrition.fiber}g
              </div>
            </div>
          )}
          
          {nutrition.sugar !== undefined && (
            <div className="p-2 bg-secondary/20 rounded">
              <div className="text-xs uppercase font-medium">Sugar</div>
              <div className={`text-sm font-bold ${nutrition.sugar > 0 ? 'text-red-500' : nutrition.sugar < 0 ? 'text-green-500' : ''}`}>
                {nutrition.sugar > 0 ? '+' : ''}{nutrition.sugar}g
              </div>
            </div>
          )}
          
          {nutrition.sodium !== undefined && (
            <div className="p-2 bg-secondary/20 rounded">
              <div className="text-xs uppercase font-medium">Sodium</div>
              <div className={`text-sm font-bold ${nutrition.sodium > 0 ? 'text-red-500' : nutrition.sodium < 0 ? 'text-green-500' : ''}`}>
                {nutrition.sodium > 0 ? '+' : ''}{nutrition.sodium}mg
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

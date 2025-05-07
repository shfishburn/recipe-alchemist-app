
import React from 'react';
import { LightbulbIcon } from 'lucide-react';

interface RecipeHighlightsProps {
  nutritionHighlight?: string;
  cookingTip?: string;
}

export function RecipeHighlights({ nutritionHighlight, cookingTip }: RecipeHighlightsProps) {
  if (!nutritionHighlight && !cookingTip) return null;
  
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {nutritionHighlight && (
        <div className="bg-slate-50 p-3 rounded-lg flex-1">
          <p className="text-sm font-medium">Nutrition Highlight</p>
          <p className="text-sm text-muted-foreground">{nutritionHighlight}</p>
        </div>
      )}
      {cookingTip && (
        <div className="bg-recipe-orange/10 p-3 rounded-lg flex-1">
          <p className="text-sm font-medium flex items-center gap-1">
            <LightbulbIcon className="h-4 w-4 text-recipe-orange" />
            Cooking Tip
          </p>
          <p className="text-sm text-muted-foreground">{cookingTip}</p>
        </div>
      )}
    </div>
  );
}


import React from 'react';
import { Clock, CookingPot } from 'lucide-react';

interface RecipeTimeInfoProps {
  prepTime: number;
  cookTime: number;
}

export function RecipeTimeInfo({ prepTime, cookTime }: RecipeTimeInfoProps) {
  const totalTime = prepTime + cookTime;
  
  return (
    <div className="flex justify-around border-t border-b py-3">
      {prepTime > 0 && (
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Prep</div>
          <div className="flex items-center justify-center gap-1 font-medium">
            <Clock className="h-4 w-4 text-recipe-green" />
            {prepTime} min
          </div>
        </div>
      )}
      
      {cookTime > 0 && (
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Cook</div>
          <div className="flex items-center justify-center gap-1 font-medium">
            <CookingPot className="h-4 w-4 text-recipe-orange" />
            {cookTime} min
          </div>
        </div>
      )}
      
      <div className="text-center">
        <div className="text-xs text-muted-foreground">Total</div>
        <div className="font-medium">
          {totalTime} min
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Clock, CookingPot } from 'lucide-react';

interface RecipeTimeInfoProps {
  prepTime: number;
  cookTime: number;
  servings?: number; // Added servings prop
}

export function RecipeTimeInfo({ prepTime, cookTime, servings }: RecipeTimeInfoProps) {
  const totalTime = prepTime + cookTime;
  
  return (
    <div className="flex justify-around border-t border-b py-3">
      {prepTime > 0 && (
        <div className="text-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">Prep</div>
          <div className="font-medium">
            {prepTime} min
          </div>
        </div>
      )}
      
      {cookTime > 0 && (
        <div className="text-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">Cook</div>
          <div className="font-medium">
            {cookTime} min
          </div>
        </div>
      )}
      
      <div className="text-center flex-1">
        <div className="text-xs text-muted-foreground mb-1">Total</div>
        <div className="font-medium">
          {totalTime} min
        </div>
      </div>
      
      {servings && (
        <div className="text-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">Servings</div>
          <div className="font-medium">
            {servings}
          </div>
        </div>
      )}
    </div>
  );
}

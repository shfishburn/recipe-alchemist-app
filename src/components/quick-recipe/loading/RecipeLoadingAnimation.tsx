
import React from 'react';
import { ChefHat } from 'lucide-react';
import { LoadingAnimation } from './LoadingAnimation';

interface RecipeLoadingAnimationProps {
  showFinalAnimation: boolean;
  isStalled?: boolean;
}

export function RecipeLoadingAnimation({ 
  showFinalAnimation, 
  isStalled = false 
}: RecipeLoadingAnimationProps) {
  return (
    <div className="relative transform-gpu">
      {showFinalAnimation ? (
        <LoadingAnimation showFinalAnimation={true} />
      ) : (
        <div className="relative">
          {isStalled ? (
            <LoadingAnimation showFinalAnimation={false} isStalled={true} />
          ) : (
            <>
              <ChefHat className="h-12 w-12 text-recipe-green animate-float" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-recipe-green rounded-full animate-pulse" />
              <div className="steam animate-steam bg-white/80 dark:bg-gray-200/80" style={{ animationDelay: "0.2s" }}></div>
              <div className="steam animate-steam bg-white/80 dark:bg-gray-200/80" style={{ animationDelay: "0.8s", left: "12px" }}></div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

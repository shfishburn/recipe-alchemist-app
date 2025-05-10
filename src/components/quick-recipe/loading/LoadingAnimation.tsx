
import React from 'react';
import { CookingPot, CircleCheck, PartyPopper, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  showFinalAnimation: boolean;
}

export function LoadingAnimation({ showFinalAnimation }: LoadingAnimationProps) {
  return (
    <div className="relative">
      {showFinalAnimation ? (
        <div className="flex items-center justify-center">
          <CircleCheck className="h-10 w-10 sm:h-12 sm:w-12 text-recipe-green animate-scale-in" />
          <PartyPopper className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 text-recipe-orange animate-bounce" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <div className={cn(
            "loading-pot-container relative",
            "transform-gpu"
          )}>
            <CookingPot className="h-12 w-12 sm:h-16 sm:w-16 text-recipe-green animate-cooking-pot" />
            <div className="absolute top-0 -right-1 h-3 w-3 bg-recipe-orange rounded-full animate-ping" />
            
            {/* Utensils - mobile responsive */}
            <Utensils className="absolute -bottom-1 -right-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-600 rotate-45 opacity-70" />
            
            {/* Steam effects with improved visibility and responsive sizing */}
            <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "0s" }}></div>
            <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "0.6s", left: "15px" }}></div>
            <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "1.2s", left: "10px" }}></div>
            <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "0.9s", left: "20px" }}></div>
            
            {/* Animated bubbles inside the pot - mobile responsive */}
            <div className="absolute top-1/2 left-1/4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 rounded-full animate-bubble" style={{ animationDelay: "0.2s" }}></div>
            <div className="absolute top-1/2 left-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white/50 rounded-full animate-bubble" style={{ animationDelay: "0.7s" }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

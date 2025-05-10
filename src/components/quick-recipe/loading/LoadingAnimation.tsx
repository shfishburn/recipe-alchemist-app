
import React from 'react';
import { CookingPot, CircleCheck, PartyPopper, Utensils } from 'lucide-react';

interface LoadingAnimationProps {
  showFinalAnimation: boolean;
}

export function LoadingAnimation({ showFinalAnimation }: LoadingAnimationProps) {
  return (
    <div className="relative">
      {showFinalAnimation ? (
        <div className="flex items-center justify-center">
          <CircleCheck className="h-12 w-12 text-recipe-green animate-scale-in" />
          <PartyPopper className="absolute -top-2 -right-2 h-6 w-6 text-recipe-orange animate-bounce" />
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <div className="loading-pot-container relative">
            <CookingPot className="h-16 w-16 text-recipe-green animate-cooking-pot" />
            <div className="absolute top-0 -right-1 h-3 w-3 bg-recipe-orange rounded-full animate-ping" />
            
            {/* Utensils */}
            <Utensils className="absolute -bottom-1 -right-3 h-8 w-8 text-gray-600 rotate-45 opacity-70" />
            
            {/* Steam effects with improved visibility */}
            <div className="steam animate-steam bg-white/80" style={{ animationDelay: "0s" }}></div>
            <div className="steam animate-steam bg-white/80" style={{ animationDelay: "0.6s", left: "15px" }}></div>
            <div className="steam animate-steam bg-white/80" style={{ animationDelay: "1.2s", left: "10px" }}></div>
            <div className="steam animate-steam bg-white/80" style={{ animationDelay: "0.9s", left: "20px" }}></div>
            
            {/* Animated bubbles inside the pot */}
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/50 rounded-full animate-bubble" style={{ animationDelay: "0.2s" }}></div>
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-bubble" style={{ animationDelay: "0.7s" }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

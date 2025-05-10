
import React from 'react';
import { CookingPot, CircleCheck, PartyPopper } from 'lucide-react';

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
        <div className="relative">
          <CookingPot className="h-12 w-12 text-primary animate-cooking-pot" />
          <div className="absolute -top-2 -right-2 h-3 w-3 bg-recipe-orange rounded-full animate-ping" />
          {/* Steam effects */}
          <div className="steam animate-steam" style={{ animationDelay: "0s" }}></div>
          <div className="steam animate-steam" style={{ animationDelay: "0.6s", left: "15px" }}></div>
          <div className="steam animate-steam" style={{ animationDelay: "1.2s", left: "10px" }}></div>
        </div>
      )}
    </div>
  );
}

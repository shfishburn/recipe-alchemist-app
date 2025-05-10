
import React from 'react';
import { ChefHat } from 'lucide-react';

export function RecipeLoadingAnimation() {
  return (
    <div className="relative transform-gpu">
      <ChefHat 
        className="h-16 w-16 text-recipe-green animate-cooking-pot" 
        aria-hidden="true"
      />
      <div className="steam" aria-hidden="true" style={{ animationDelay: "0.2s" }}></div>
      <div className="steam" aria-hidden="true" style={{ animationDelay: "0.8s", left: "12px" }}></div>
      <div className="absolute -top-1 -right-1 h-3 w-3 bg-recipe-green rounded-full animate-pulse" aria-hidden="true" />
    </div>
  );
}

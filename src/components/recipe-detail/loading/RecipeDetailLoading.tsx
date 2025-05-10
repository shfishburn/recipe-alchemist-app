
import React from 'react';
import { Loader2, CookingPot, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RecipeDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          {/* Enhanced loading indicator - mobile responsive */}
          <div className="flex flex-col items-center justify-center my-6 sm:my-12 min-h-[250px] sm:min-h-[300px]">
            <div className={cn(
              "relative bg-white/90 dark:bg-gray-800/90 p-4 sm:p-8 rounded-xl shadow-lg",
              "border border-gray-100 dark:border-gray-700 flex flex-col items-center",
              "w-5/6 sm:w-auto max-w-sm sm:max-w-md hw-accelerated animate-fade-in"
            )}>
              <div className="relative mb-4 sm:mb-6">
                <div className="loading-pot-container relative">
                  <CookingPot className="h-12 w-12 sm:h-16 sm:w-16 text-recipe-green animate-cooking-pot" />
                  <Utensils className="absolute -bottom-1 -right-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-600 rotate-45 opacity-70" />
                  
                  {/* Steam effects - mobile responsive */}
                  <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "0s" }}></div>
                  <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "0.6s", left: "15px" }}></div>
                  <div className="steam animate-steam bg-white/80 dark:bg-gray-300/80" style={{ animationDelay: "1.2s", left: "5px" }}></div>
                </div>
                <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-recipe-green rounded-full animate-pulse" />
              </div>
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-recipe-blue mb-3 sm:mb-4" />
              <div className="text-center">
                <p className="font-medium text-base sm:text-lg mb-1">Loading recipe...</p>
                <span className="text-xs sm:text-sm text-muted-foreground">Preparing your culinary experience</span>
              </div>
              
              {/* Enhanced progress bar with animation - mobile responsive */}
              <div className="mt-4 sm:mt-6 w-36 sm:w-48 h-1.5 sm:h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-recipe-green to-recipe-blue animate-progress-bar rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Default export for compatibility with lazy loading
export default RecipeDetailLoading;

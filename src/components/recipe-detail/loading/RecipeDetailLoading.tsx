
import React from 'react';
import { Loader2, CookingPot, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from '@/styles/loading.module.css';

export function RecipeDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      {/* Top loading bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-recipe-green to-recipe-blue animate-pulse"></div>
      
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          {/* Enhanced loading indicator - mobile responsive */}
          <div className="flex flex-col items-center justify-center my-6 sm:my-12 min-h-[250px] sm:min-h-[300px] p-4">
            <div className={cn(
              "relative bg-white/90 dark:bg-gray-800/90 p-4 sm:p-8 rounded-xl shadow-lg",
              "border border-gray-100 dark:border-gray-700 flex flex-col items-center",
              "w-full sm:w-auto max-w-sm sm:max-w-md",
              styles.hwAccelerated
            )}>
              <div className="relative mb-4 sm:mb-6">
                <div className="relative">
                  <CookingPot className={cn("h-12 w-12 sm:h-16 sm:w-16 text-recipe-green", styles.animateCookingPot)} />
                  <Utensils className="absolute -bottom-1 -right-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-600 rotate-45 opacity-70" />
                  
                  {/* Steam effects - mobile responsive */}
                  <div className={`${styles.steam} ${styles.steam1}`}></div>
                  <div className={`${styles.steam} ${styles.steam2}`}></div>
                  <div className={`${styles.steam} ${styles.steam3}`}></div>
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
                <div className={`h-full bg-gradient-to-r from-recipe-green to-recipe-blue ${styles.animateProgressPulse} rounded-full`} />
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

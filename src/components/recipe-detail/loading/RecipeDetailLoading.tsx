
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { Loader2, ChefHat } from 'lucide-react';

export function RecipeDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          {/* Enhanced loading indicator */}
          <div className="flex flex-col items-center justify-center my-12 min-h-[300px]">
            <div className="relative bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center">
              <div className="relative mb-6">
                <ChefHat className="h-12 w-12 text-recipe-green animate-float" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-recipe-green rounded-full animate-pulse" />
              </div>
              <Loader2 className="h-8 w-8 animate-spin text-recipe-blue mb-4" />
              <div className="text-center">
                <p className="font-medium text-lg mb-1">Loading recipe...</p>
                <span className="text-sm text-muted-foreground">Preparing your culinary experience</span>
              </div>
              
              {/* Simple progress bar */}
              <div className="mt-6 w-48 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
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

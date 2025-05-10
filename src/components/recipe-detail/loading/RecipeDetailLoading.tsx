
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { Loader2 } from 'lucide-react';

export function RecipeDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          {/* Loading indicator with fallback */}
          <div className="flex flex-col items-center justify-center my-12 min-h-[300px]">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-recipe-green" />
              <div className="absolute -bottom-8 w-full text-center">
                <span className="text-sm text-muted-foreground">Loading recipe...</span>
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

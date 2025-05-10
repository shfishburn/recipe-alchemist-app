
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageLoadingFallback() {
  // This component is used for Suspense fallback, so it should always show loading state
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 py-8 md:py-12 bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative mb-6">
          <Loader2 className="h-12 w-12 text-recipe-green animate-spin" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-recipe-blue rounded-full animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Loading content...</h2>
        <p className="text-muted-foreground text-sm">Please wait a moment</p>
      </div>
      
      <div className={cn(
        "w-full max-w-3xl mx-auto",
        "space-y-8 min-h-[200px]"
      )}>
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="h-10 w-48 md:w-64" />
          <Skeleton className="h-5 w-64 md:w-80 mt-3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="min-h-[200px]">
              <Skeleton className="h-48 rounded-lg mb-3" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-md mt-8">
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-recipe-green to-recipe-blue animate-progress-bar rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Default export for compatibility with lazy loading
export default PageLoadingFallback;

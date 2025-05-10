
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export function PageLoadingFallback() {
  // This component is used for Suspense fallback, so it should always show loading state
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto p-4 py-8 md:py-12 bg-white dark:bg-gray-950">
      <div className="space-y-8 min-h-[400px]">
        {/* Loading indicator at the top */}
        <div className="w-full fixed top-0 left-0 right-0 z-50">
          <div className="bg-green-500 h-1 animate-pulse" style={{ width: '60%' }}></div>
        </div>
        
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Central loading spinner */}
          <div className="mb-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          
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
    </div>
  );
}

// Default export for compatibility with lazy loading
export default PageLoadingFallback;

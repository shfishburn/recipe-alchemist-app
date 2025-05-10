
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function PageLoadingFallback() {
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto p-4 py-8 md:py-12">
      <div className="space-y-8 min-h-[400px]">
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
    </div>
  );
}

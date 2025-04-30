
import React, { useState, useEffect } from 'react';
import { CookingPot } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// Array of loading messages to display in rotation
const LOADING_MESSAGES = [
  "Creating your recipe...",
  "Measuring ingredients...",
  "Adding scientific techniques...",
  "Calculating cooking times...",
  "Finalizing instructions...",
  "Perfecting flavors...",
  "Almost ready..."
];

export function QuickRecipeLoading() {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Rotate through loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-8 text-center">
        {/* Animated cooking pot icon */}
        <div className="relative">
          <CookingPot className="h-16 w-16 text-primary animate-bounce" />
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-recipe-orange rounded-full animate-ping" />
        </div>
        
        {/* Loading message */}
        <h2 className="text-xl font-semibold">{LOADING_MESSAGES[messageIndex]}</h2>
        
        {/* Visual loading bar */}
        <div className="w-full max-w-xs bg-muted rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full animate-pulse w-full"></div>
        </div>
        
        {/* Recipe card skeleton */}
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-2/3 mx-auto" />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          This usually takes about 15-20 seconds...
        </p>
      </div>
    </div>
  );
}

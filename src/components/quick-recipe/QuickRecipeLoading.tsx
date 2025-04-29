
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CookingPot } from 'lucide-react';

const loadingTexts = [
  "Finding the perfect ingredients...",
  "Mixing flavors together...",
  "Adjusting seasoning...",
  "Adding a dash of creativity...",
  "Preparing your recipe...",
];

export function QuickRecipeLoading() {
  const [loadingIndex, setLoadingIndex] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-md animate-pulse">
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="relative mb-4">
          <CookingPot className="h-12 w-12 text-recipe-green animate-bounce" />
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-recipe-orange animate-ping"></div>
        </div>
        <p className="text-lg font-medium text-center">{loadingTexts[loadingIndex]}</p>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Creating your personalized recipe...
        </p>
      </CardContent>
    </Card>
  );
}

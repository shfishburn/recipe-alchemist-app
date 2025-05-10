
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LoadingBar from 'react-top-loading-bar';

export function ChatLoading() {
  const loadingRef = useRef<any>(null);
  
  useEffect(() => {
    loadingRef.current?.continuousStart();
    return () => loadingRef.current?.complete();
  }, []);

  return (
    <Card className="border-slate-100">
      <CardContent className="pt-2 sm:pt-6 relative">
        <LoadingBar color="#4CAF50" height={3} ref={loadingRef} shadow={true} className="absolute top-0 left-0 right-0" />
        <div className="w-full flex justify-center items-center min-h-[150px] py-8">
          <div className="space-y-4 text-center">
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-recipe-green animate-pulse rounded-full" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

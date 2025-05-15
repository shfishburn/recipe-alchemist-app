
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ChatLoadingProps {
  onRetry?: () => void;
  retryCount?: number;
}

export function ChatLoading({ onRetry, retryCount = 0 }: ChatLoadingProps) {
  const showRetry = retryCount > 0;

  return (
    <Card className="bg-white border-slate-100 shadow-sm overflow-hidden flex flex-col h-full hw-boost">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex flex-col items-center justify-center h-full p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <LoadingSpinner size="lg" className="text-recipe-green" />
              <div className="absolute inset-0 loading-pulse-ring border-2 border-recipe-green/30"></div>
              <div className="absolute inset-0 loading-pulse-ring border-2 border-recipe-green/20" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <p className="text-muted-foreground text-sm animate-pulse">Loading chat history...</p>
            
            {showRetry && onRetry && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {retryCount > 2 
                    ? "Having trouble connecting..." 
                    : "Taking longer than expected..."}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRetry} 
                  className="touch-optimized"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {retryCount > 2 ? "Try again" : "Reload"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

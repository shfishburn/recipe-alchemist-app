
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserMessageProps {
  message: string;
  isOptimistic?: boolean;
  isFailed?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function UserMessage({ 
  message, 
  isOptimistic = false, 
  isFailed = false,
  showRetry = false,
  onRetry
}: UserMessageProps) {
  return (
    <div className={`flex items-start space-x-2 ${isOptimistic ? 'opacity-80' : ''}`}>
      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <User className="h-4 w-4 text-blue-600" />
      </div>
      
      <div className="flex-1">
        <div className={`${isFailed ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'} 
                        border rounded-2xl rounded-tl-sm p-3`}>
          <p className="text-sm text-slate-800 whitespace-pre-wrap break-words">
            {message}
          </p>
          
          {/* Show retry button for failed messages */}
          {showRetry && onRetry && (
            <div className="mt-2 flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto text-xs flex items-center gap-1"
                onClick={onRetry}
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </Button>
              <span className="text-xs text-red-500 ml-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Failed to send
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function UserMessageSkeleton() {
  return (
    <div className="flex items-start space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
}


import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/style-utils';
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
    <div className="flex flex-col items-end">
      <div
        className={cn(
          "bg-primary text-white py-2 px-4 rounded-2xl max-w-[85%] break-words relative",
          isOptimistic && !isFailed && "opacity-70",
          isFailed && "bg-red-500"
        )}
      >
        <p className="text-sm sm:text-base whitespace-pre-wrap">{message}</p>
      </div>
      
      {(isOptimistic || isFailed) && (
        <div className="text-xs text-gray-500 mt-1 flex items-center">
          {isFailed ? (
            <span className="flex items-center text-red-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              Failed to send
            </span>
          ) : (
            <span>Sending...</span>
          )}
          
          {showRetry && onRetry && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="py-0 h-6 ml-2 text-xs text-primary hover:text-primary-dark"
              onClick={onRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

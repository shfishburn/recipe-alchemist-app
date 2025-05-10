
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserMessageProps {
  message: string;
  isOptimistic?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function UserMessage({ 
  message, 
  isOptimistic = false,
  isError = false,
  onRetry 
}: UserMessageProps) {
  const OpacityClass = isOptimistic ? 'opacity-70' : '';
  
  return (
    <div className="flex justify-end">
      <div className="max-w-[calc(100%-32px)]">
        <div className={`inline-block rounded-[20px] rounded-tr-[5px] px-4 py-2
                       bg-recipe-blue text-white ${OpacityClass} 
                       ${isError ? 'bg-red-500' : ''}`}>
          <p className="text-sm break-words">{message}</p>
          
          {isError && onRetry && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-1 text-white hover:text-white hover:bg-red-600 p-1 h-auto text-xs w-full flex justify-center"
              onClick={onRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
        
        {isOptimistic && !isError && (
          <div className="mt-1 text-xs text-gray-400 text-right pr-2">
            Processing...
          </div>
        )}
        
        {isError && (
          <div className="mt-1 text-xs text-red-500 text-right pr-2">
            Failed to send
          </div>
        )}
      </div>
    </div>
  );
}
